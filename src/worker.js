// Worker de Cloudflare: sirve la aplicación (carpeta public/), el libro protegido (/api/libro/…)
// y el Guardián (/api/guardian).
//
// El TEXTO DEL LIBRO no está en GitHub ni en public/: vive en la base D1 «jardin-magico-libro»
// (binding LIBRO). Se entrega una página a la vez, codificada, solo a la propia página del libro.
// © Editorial Pluma de Oro S.A.S. Lectura en pantalla, sin descarga.
import { construirPrompt } from '../public/js/guardian.js';

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

async function indice(env) {
  const [pags, unidades] = await Promise.all([
    env.LIBRO.prepare('SELECT orden, id, unidad, tipo, titulo FROM paginas ORDER BY orden').all(),
    env.LIBRO.prepare("SELECT valor FROM meta WHERE clave = 'unidades'").first('valor'),
  ]);
  return { unidades: JSON.parse(unidades || '[]'), paginas: pags.results };
}

async function libro(request, env, ruta) {
  if (!env.LIBRO) return json({ code: 'sin_libro' }, 503);
  if (!permitido(request)) return json({ code: 'solo_lectura_en_pantalla' }, 403);
  if (ruta === 'indice') return json(codificar(await indice(env)));
  const m = /^pagina\/([a-z0-9-]{1,80})$/.exec(ruta);
  if (!m) return json({ code: 'invalid_request' }, 404);
  const fila = await env.LIBRO.prepare('SELECT datos FROM paginas WHERE id = ?').bind(m[1]).first('datos');
  if (!fila) return json({ code: 'no_existe' }, 404);
  return json(codificar(JSON.parse(fila)));
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

  const id = String(body.cuentoId || '');
  const fila = env.LIBRO && /^[a-z0-9-]{1,80}$/.test(id) ? await env.LIBRO.prepare('SELECT datos FROM paginas WHERE id = ?').bind(id).first('datos') : null;
  if (!fila) return json({ code: 'invalid_request' }, 404);
  const p = JSON.parse(fila);
  const cuento = { titulo: p.titulo, texto: (p.parrafos || []).map((x) => x.replace(/\*\*/g, '')) };

  const { prompt, json: esJson } = construirPrompt({ tarea, cuento, grado, consigna: String(body.consigna || ''), respuesta });
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/guardian') return guardian(request, env);
    if (url.pathname.startsWith('/api/libro/')) return libro(request, env, url.pathname.slice('/api/libro/'.length));
    const r = await env.ASSETS.fetch(request);
    // Cabeceras de protección para la aplicación.
    const h = new Headers(r.headers);
    h.set('x-frame-options', 'SAMEORIGIN');
    h.set('referrer-policy', 'same-origin');
    return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
  },
};
