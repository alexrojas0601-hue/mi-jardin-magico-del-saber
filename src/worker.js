// Worker de Cloudflare: sirve la aplicación (carpeta public/), el libro protegido (/api/libro/…)
// y el Guardián (/api/guardian).
//
// El TEXTO DEL LIBRO no está legible en GitHub ni en public/: viaja cifrado dentro del Worker y la llave
// vive en la base D1 «jardin-magico-libro» (binding LIBRO). Se entrega una página a la vez, codificada,
// solo a la propia página del libro.
// © Editorial Pluma de Oro S.A.S. Lectura en pantalla, sin descarga.
import { construirPrompt } from '../public/js/guardian.js';
// Libro cifrado (AES-256-GCM sobre gzip). La llave NO está en el repositorio: vive en D1 (meta.clave_libro).
import CIFRADO from './libro.cifrado.txt';

const GRADOS = ['Transición', '1.°', '2.°', '3.°'];
const SAL = 'JardinMagico-CENTEC-lectura-en-pantalla';

const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', ...extra },
});

// Solo la propia página del libro puede pedir el contenido.
function permitido(request) {
  if (request.headers.get('x-jardin') !== 'lector') return false;
  const sitio = request.headers.get('sec-fetch-site');
  if (sitio) return sitio === 'same-origin';
  try { return new URL(request.headers.get('referer') || '').host === new URL(request.url).host; } catch { return false; }
}

// Codificación ligera: evita que el texto viaje legible y se copie desde la red.
function codificar(obj) {
  const nonce = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const datos = new TextEncoder().encode(JSON.stringify(obj));
  const llave = new TextEncoder().encode(nonce + SAL);
  for (let i = 0; i < datos.length; i++) datos[i] ^= llave[i % llave.length] ^ ((i * 31) & 255);
  let bin = '';
  for (let i = 0; i < datos.length; i += 0x8000) bin += String.fromCharCode.apply(null, datos.subarray(i, i + 0x8000));
  return { n: nonce, d: btoa(bin) };
}

let cargando = null;
async function abrirLibro(env) {
  if (!cargando) {
    cargando = (async () => {
      const clave = await env.LIBRO.prepare("SELECT valor FROM meta WHERE clave = 'clave_libro'").first('valor');
      if (!clave) throw new Error('sin clave');
      const llave = await crypto.subtle.importKey('raw', Uint8Array.from(atob(clave), (c) => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt']);
      const todo = Uint8Array.from(atob(CIFRADO.trim()), (c) => c.charCodeAt(0));
      const gz = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: todo.slice(0, 12), additionalData: new TextEncoder().encode('jardin-magico-del-saber') }, llave, todo.slice(12));
      const texto = await new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
      const libro = JSON.parse(texto);
      return {
        indice: { unidades: libro.unidades, paginas: libro.paginas.map(({ orden, id, unidad, tipo, titulo }) => ({ orden, id, unidad, tipo, titulo })) },
        paginas: new Map(libro.paginas.map((p) => [p.id, p])),
      };
    })().catch((e) => { cargando = null; throw e; });
  }
  return cargando;
}

async function libro(request, env, ruta) {
  if (!env.LIBRO) return json({ code: 'sin_libro' }, 503);
  if (!permitido(request)) return json({ code: 'solo_lectura_en_pantalla' }, 403);
  let L;
  try { L = await abrirLibro(env); } catch { return json({ code: 'sin_libro' }, 503); }
  if (ruta === 'indice') return json(codificar(L.indice));
  const m = /^pagina\/([a-z0-9-]{1,80})$/.exec(ruta);
  if (!m) return json({ code: 'invalid_request' }, 404);
  const p = L.paginas.get(m[1]);
  if (!p) return json({ code: 'no_existe' }, 404);
  return json(codificar(await conIlustraciones(env, p)));
}

async function guardian(request, env) {
  if (request.method === 'GET') return json({ ok: Boolean(env.ANTHROPIC_API_KEY) });
  if (request.method !== 'POST') return json({ code: 'invalid_request' }, 405);
  if (!env.ANTHROPIC_API_KEY) return json({ code: 'not_granted' }, 503);
  if (!permitido(request)) return json({ code: 'invalid_request' }, 403);

  let body;
  try { body = await request.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  const tarea = body.tarea === 'preguntas' ? 'preguntas' : 'comentario';
  const grado = GRADOS.includes(body.grado) ? body.grado : '1.°';
  const respuesta = String(body.respuesta || '').slice(0, 2000);
  if (tarea === 'comentario' && respuesta.trim().length < 3) return json({ code: 'invalid_request' }, 400);

  let p = null;
  try { p = (await abrirLibro(env)).paginas.get(String(body.cuentoId || '')); } catch { /* sin libro */ }
  if (!p) return json({ code: 'invalid_request' }, 404);
  const idioma = body.idioma === 'en' && p.en?.parrafos?.length ? 'en' : 'es';
  const fuente = idioma === 'en' ? p.en : p;
  const cuento = { titulo: fuente.titulo, texto: (fuente.parrafos || []).map((x) => x.replace(/\*\*/g, '')) };

  const { prompt, json: esJson } = construirPrompt({ tarea, cuento, grado, consigna: String(body.consigna || ''), respuesta, idioma });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: env.MODELO || 'claude-haiku-5-5', max_tokens: 700, messages: [{ role: 'user', content: prompt }] }),
  });
  if (r.status === 429) return json({ code: 'rate_limited' }, 429);
  if (!r.ok) return json({ code: 'upstream_error' }, 502);
  const data = await r.json();
  const texto = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  if (!texto) return json({ code: 'empty_completion' }, 502);

  if (!esJson) return json({ texto });
  const ini = texto.indexOf('['); const fin = texto.lastIndexOf(']');
  try { return json({ preguntas: JSON.parse(texto.slice(ini, fin + 1)) }); }
  catch { return json({ code: 'invalid_json' }, 502); }
}

/* ---------- Voz del Guardián: voz neuronal en español generada en Cloudflare ----------
   Aura-2 (Deepgram) en Workers AI; si no está disponible, MeloTTS. Cada oración se genera una sola vez
   y se guarda en D1 (tabla voz) y en la caché de Cloudflare. */
const VOCES = ['celeste', 'estrella', 'diana', 'selena', 'carina', 'aquila', 'sirio', 'nestor', 'alvaro', 'javier'];
const VOCES_EN = ['asteria', 'orion', 'luna', 'athena', 'hera', 'arcas']; // existen en aura-2-en y en aura-1 (respaldo)
async function huella(t) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const audioResp = (cuerpo, tipo) => new Response(cuerpo, { headers: { 'content-type': tipo, 'cache-control': 'public, max-age=31536000, immutable', 'x-robots-tag': 'noindex' } });
function anotar(env, ctx, origen, detalle) {
  if (!env.LIBRO) return;
  const p = env.LIBRO.prepare('INSERT INTO voz_log (origen, detalle) VALUES (?, ?)').bind(String(origen).slice(0, 40), String(detalle).slice(0, 900)).run().catch(() => {});
  if (ctx) ctx.waitUntil(p);
}
async function aBuffer(r) {
  if (!r) return null;
  if (r instanceof Response) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 300)); return r.arrayBuffer(); }
  if (r instanceof ReadableStream) return new Response(r).arrayBuffer();
  if (r instanceof ArrayBuffer) return r;
  if (ArrayBuffer.isView(r)) return r.buffer;
  if (typeof r.audio === 'string') return Uint8Array.from(atob(r.audio), (c) => c.charCodeAt(0)).buffer;
  throw new Error('respuesta desconocida: ' + JSON.stringify(r).slice(0, 200));
}
async function generarVoz(env, ctx, texto, voz, idioma = 'es') {
  if (!env.AI) throw new Error('sin binding AI');
  const fallas = [];
  const intentos = idioma === 'en' ? [
    ['aura-2-en', () => env.AI.run('@cf/deepgram/aura-2-en', { text: texto, speaker: voz, encoding: 'mp3' }, { returnRawResponse: true })],
    ['aura-1', () => env.AI.run('@cf/deepgram/aura-1', { text: texto, speaker: voz, encoding: 'mp3' }, { returnRawResponse: true })],
    ['melotts-en', () => env.AI.run('@cf/myshell-ai/melotts', { prompt: texto, lang: 'en' })],
  ] : [
    ['aura-2-es', () => env.AI.run('@cf/deepgram/aura-2-es', { text: texto, speaker: voz, encoding: 'mp3' }, { returnRawResponse: true })],
    ['aura-2-es-b', () => env.AI.run('@cf/deepgram/aura-2-es', { text: texto, speaker: voz })],
    ['melotts', () => env.AI.run('@cf/myshell-ai/melotts', { prompt: texto, lang: 'es' })],
  ];
  for (const [nombre, f] of intentos) {
    try {
      const datos = await aBuffer(await f());
      if (datos && datos.byteLength > 200) return { datos, tipo: 'audio/mpeg', motor: nombre };
      fallas.push(nombre + ': audio vacío');
    } catch (e) { fallas.push(nombre + ': ' + (e?.message || e)); }
  }
  anotar(env, ctx, 'servidor', `[${texto.length} car.] ${fallas.join(' | ')}`);
  throw new Error(fallas.join(' | '));
}
async function vozGuardian(request, env, ctx) {
  const url = new URL(request.url);
  if (url.searchParams.get('estado') === '1') return json({ ok: Boolean(env.AI) });
  if (request.method === 'POST') {
    // Diagnóstico desde la página: qué falló en el dispositivo del lector.
    let d = {}; try { d = await request.json(); } catch { /* nada */ }
    anotar(env, ctx, 'pagina', JSON.stringify({ ...d, ua: request.headers.get('user-agent') }).slice(0, 900));
    return json({ ok: true });
  }
  if (!permitido(request)) return json({ code: 'invalid_request' }, 403);
  const texto = String(url.searchParams.get('t') || '').replace(/\s+/g, ' ').trim().slice(0, 600);
  const idioma = url.searchParams.get('l') === 'en' ? 'en' : 'es';
  const lista = idioma === 'en' ? VOCES_EN : VOCES;
  const voz = lista.includes(url.searchParams.get('v')) ? url.searchParams.get('v') : lista[0];
  if (texto.length < 1) return json({ code: 'invalid_request' }, 400);
  const clave = await huella((idioma === 'en' ? 'en|' : '') + voz + '|' + texto);
  const cache = caches.default;
  const llaveCache = new Request(new URL('/__voz/' + clave, request.url).toString());
  const enCache = await cache.match(llaveCache);
  if (enCache) return enCache;
  if (env.LIBRO) {
    const fila = await env.LIBRO.prepare('SELECT audio, tipo FROM voz WHERE clave = ?').bind(clave).first();
    if (fila) {
      const r = audioResp(new Uint8Array(fila.audio), fila.tipo);
      ctx.waitUntil(cache.put(llaveCache, r.clone()));
      return r;
    }
  }
  let a;
  try { a = await generarVoz(env, ctx, texto, voz, idioma); } catch (e) { return json({ code: 'sin_voz', detalle: String(e?.message || e).slice(0, 300) }, 503); }
  const r = audioResp(a.datos, a.tipo);
  if (a.motor !== 'aura-2-es' && a.motor !== 'aura-2-en') anotar(env, ctx, 'servidor', 'audio generado con ' + a.motor);
  ctx.waitUntil(Promise.all([
    cache.put(llaveCache, r.clone()),
    env.LIBRO ? env.LIBRO.prepare('INSERT OR IGNORE INTO voz (clave, audio, tipo) VALUES (?, ?, ?)').bind(clave, a.datos, a.tipo).run().catch(() => {}) : null,
  ]));
  return r;
}

/* ---------- Ilustraciones: generadas con Workers AI, visibles para los niños SOLO cuando un revisor las aprueba ----------
   Las escenas viven en el libro cifrado (página.ilustraciones); las imágenes, en D1 (tabla ilustracion).
   Revisor = quien envía la cabecera x-revision con meta.clave_revision. */
// Estilo pedido por el rector (30-10-2026): dibujos animados con ojos grandes y boca grande.
// Evidencia: los rasgos infantiles (ojos grandes, cara redonda) atraen la mirada de niños de 3 a 6 años
// (Borgi et al., 2014, Frontiers in Psychology, https://doi.org/10.3389/fpsyg.2014.00411).
const ESTILO_ILUS = "Bright cartoon illustration for a children's picture book, characters with very big round shiny eyes, big expressive smiling mouths and round friendly faces, bold clean outlines, cheerful saturated colors, simple uncluttered background, the scene shows exactly what the sentence describes, calm and safe for young children, absolutely no text, no letters, no words, no numbers.";
let tablaLista = false;
async function tablaIlus(env) {
  if (tablaLista) return;
  await env.LIBRO.prepare('CREATE TABLE IF NOT EXISTS ilustracion (pagina TEXT NOT NULL, n INTEGER NOT NULL, estado TEXT NOT NULL, imagen BLOB, semilla INTEGER, creada TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (pagina, n))').run();
  tablaLista = true;
}
async function esRevisor(request, env) {
  const t = request.headers.get('x-revision') || '';
  if (t.length < 24 || !env.LIBRO) return false;
  const c = await env.LIBRO.prepare("SELECT valor FROM meta WHERE clave = 'clave_revision'").first('valor');
  if (!c) return false;
  const [a, b] = await Promise.all([huella(t), huella(c)]);
  return a === b;
}
async function conIlustraciones(env, p) {
  const { personajes, ...pub } = p;
  if (!p.ilustraciones?.length) return pub;
  let aprobadas = new Set();
  try {
    await tablaIlus(env);
    const r = await env.LIBRO.prepare("SELECT n FROM ilustracion WHERE pagina = ? AND estado = 'aprobada'").bind(p.id).all();
    aprobadas = new Set((r.results || []).map((x) => x.n));
  } catch { /* sin tabla: ninguna aprobada */ }
  pub.ilustraciones = p.ilustraciones.map(({ n, despues, alt }) => ({ n, despues, alt, aprobada: aprobadas.has(n) }));
  return pub;
}
function promptIlus(p, il) {
  let escena = il.escena;
  const usados = [];
  for (const [nombre, desc] of Object.entries(p.personajes || {}).sort((x, y) => y[0].length - x[0].length)) { // MAX_DOG antes que MAX
    const legible = nombre.split(/[_ ]/).map((w) => w[0] + w.slice(1).toLowerCase()).join(' ');
    if (escena.includes(nombre)) { usados.push(`${legible} is ${desc}.`); escena = escena.split(nombre).join(legible); }
  }
  return [ESTILO_ILUS, 'Scene: ' + escena + '.', ...usados].join(' ').slice(0, 2000);
}
async function ilustracion(request, env, ruta) {
  if (!env.LIBRO) return json({ code: 'sin_libro' }, 503);
  const revisor = await esRevisor(request, env);
  if (ruta === 'lista') {
    if (!revisor) return json({ code: 'not_granted' }, 403);
    await tablaIlus(env);
    const L = await abrirLibro(env);
    const estados = (await env.LIBRO.prepare('SELECT pagina, n, estado, creada FROM ilustracion').all()).results || [];
    const est = new Map(estados.map((e) => [e.pagina + '/' + e.n, e]));
    const paginas = [...L.paginas.values()].filter((p) => p.ilustraciones?.length).sort((a, b) => a.orden - b.orden)
      .map((p) => ({ id: p.id, titulo: p.titulo, tituloEn: p.en?.titulo || null, ilustraciones: p.ilustraciones.map((il) => ({ n: il.n, alt: il.alt, estado: est.get(p.id + '/' + il.n)?.estado || 'sin generar' })) }));
    return json({ paginas });
  }
  const m = /^([a-z0-9-]{1,80})\/(\d{1,3})(?:\/(generar|aprobar|rechazar))?$/.exec(ruta);
  if (!m) return json({ code: 'invalid_request' }, 404);
  const [, pagina, nTxt, accion] = m; const n = +nTxt;
  await tablaIlus(env);
  if (!accion) {
    if (request.method !== 'GET') return json({ code: 'invalid_request' }, 405);
    const fila = await env.LIBRO.prepare('SELECT estado, imagen FROM ilustracion WHERE pagina = ? AND n = ?').bind(pagina, n).first();
    if (!fila || !fila.imagen || (fila.estado !== 'aprobada' && !revisor)) return json({ code: 'no_existe' }, 404);
    return new Response(new Uint8Array(fila.imagen), { headers: { 'content-type': 'image/jpeg', 'cache-control': fila.estado === 'aprobada' && !revisor ? 'public, max-age=3600' : 'no-store', 'x-robots-tag': 'noindex' } });
  }
  if (request.method !== 'POST') return json({ code: 'invalid_request' }, 405);
  if (!revisor) return json({ code: 'not_granted' }, 403);
  if (accion === 'generar') {
    if (!env.AI) return json({ code: 'sin_ia' }, 503);
    const p = (await abrirLibro(env)).paginas.get(pagina);
    const il = p?.ilustraciones?.find((x) => x.n === n);
    if (!il) return json({ code: 'no_existe' }, 404);
    const semilla = Math.floor(Math.random() * 2 ** 31);
    let out;
    try { out = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { prompt: promptIlus(p, il), steps: 8, seed: semilla }); }
    catch (e) { return json({ code: 'sin_imagen', detalle: String(e?.message || e).slice(0, 300) }, 502); }
    if (!out?.image) return json({ code: 'sin_imagen' }, 502);
    const bytes = Uint8Array.from(atob(out.image), (c) => c.charCodeAt(0));
    await env.LIBRO.prepare("INSERT INTO ilustracion (pagina, n, estado, imagen, semilla, creada) VALUES (?, ?, 'pendiente', ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(pagina, n) DO UPDATE SET estado = 'pendiente', imagen = excluded.imagen, semilla = excluded.semilla, creada = CURRENT_TIMESTAMP")
      .bind(pagina, n, bytes, semilla).run();
    return json({ ok: true, estado: 'pendiente' });
  }
  const estado = accion === 'aprobar' ? 'aprobada' : 'rechazada';
  const r = await env.LIBRO.prepare('UPDATE ilustracion SET estado = ? WHERE pagina = ? AND n = ? AND imagen IS NOT NULL').bind(estado, pagina, n).run();
  if (!r.meta?.changes) return json({ code: 'no_existe' }, 404);
  return json({ ok: true, estado });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/voz') return vozGuardian(request, env, ctx);
    if (url.pathname === '/api/guardian') return guardian(request, env);
    if (url.pathname.startsWith('/api/libro/')) return libro(request, env, url.pathname.slice('/api/libro/'.length));
    if (url.pathname.startsWith('/api/ilustracion/')) return ilustracion(request, env, url.pathname.slice('/api/ilustracion/'.length));
    const r = await env.ASSETS.fetch(request);
    // Cabeceras de protección para la aplicación.
    const h = new Headers(r.headers);
    h.set('x-frame-options', 'SAMEORIGIN');
    h.set('referrer-policy', 'same-origin');
    return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
  },
};
