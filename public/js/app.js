// El Jardín Mágico del Saber · libro digital de CENTEC Córdoba (Cali).
// © 2025 Editorial Pluma de Oro S.A.S. Lectura en pantalla: sin descarga, copia ni impresión.
import { construirPrompt } from './guardian.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sinEmoji = (s) => String(s).replace(/\*\*/g, '').replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu, '').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?»])/g, '$1').trim();
const conNegrita = (s) => esc(String(s).replace(/\*{4,}/g, '')).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*\*/g, '');
const WHATSAPP = '573184905115';
const WHATSAPP_VISIBLE = '318 490 5115';
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Estado por persona (solo en este navegador · Ley 1581 de 2012) ---------- */
const CLAVE = 'jardin-magico-v1';
const inicial = { semillas: 0, hechas: {}, respuestas: {}, versiones: [], rol: 'estudiante', grado: '1.°', leidos: {}, pos: null, letra: 1.15, vozLenta: false, vozNombre: '' };
let yo = cargar();
function cargar() { try { return { ...inicial, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') }; } catch { return { ...inicial }; } }
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(yo)); } catch { /* sin almacenamiento: sigue en memoria */ } }
function sumar(n, id) {
  if (id) { if (yo.hechas[id]) return 0; yo.hechas[id] = true; }
  const antes = etapa(yo.semillas).i;
  yo.semillas += n; guardar(); pintarChip();
  const ahora = etapa(yo.semillas);
  aviso(ahora.i > antes ? `¡Tu árbol creció! Ahora es: ${ahora.nombre} 🌳` : `+${n} semilla${n > 1 ? 's' : ''} 🌱`);
  return n;
}

/* ---------- Árbol del Saber ---------- */
const ETAPAS = [
  { min: 0, nombre: 'Semilla' }, { min: 5, nombre: 'Brote' }, { min: 15, nombre: 'Plantita' },
  { min: 30, nombre: 'Arbolito' }, { min: 50, nombre: 'Árbol en flor' }, { min: 80, nombre: 'Árbol de estrellas' },
];
function etapa(n) { let i = 0; ETAPAS.forEach((e, k) => { if (n >= e.min) i = k; }); return { i, ...ETAPAS[i], sig: ETAPAS[i + 1] }; }
function arbolSVG(i) {
  const p = ['<ellipse class="t-ground" cx="60" cy="108" rx="46" ry="9"/>'];
  if (i === 0) p.push('<ellipse class="t-seed" cx="60" cy="102" rx="7" ry="5"/>');
  if (i === 1) p.push('<rect class="t-trunk" x="58.5" y="88" width="3" height="16" rx="1.5"/><ellipse class="t-leaf" cx="52" cy="88" rx="8" ry="4" transform="rotate(-25 52 88)"/><ellipse class="t-leaf" cx="68" cy="86" rx="8" ry="4" transform="rotate(25 68 86)"/>');
  if (i === 2) p.push('<rect class="t-trunk" x="57.5" y="70" width="5" height="36" rx="2"/><ellipse class="t-leaf" cx="48" cy="76" rx="11" ry="5" transform="rotate(-25 48 76)"/><ellipse class="t-leaf" cx="72" cy="72" rx="11" ry="5" transform="rotate(25 72 72)"/><circle class="t-leaf" cx="60" cy="64" r="9"/>');
  if (i >= 3) {
    const r = i >= 4 ? 34 : 26;
    p.push('<path class="t-trunk" d="M55 106 L56 66 Q60 60 64 66 L65 106 Z"/>');
    p.push(`<circle class="t-leaf" cx="60" cy="${i >= 4 ? 46 : 52}" r="${r}"/><circle class="t-leaf" cx="${60 - r * 0.7}" cy="${i >= 4 ? 58 : 62}" r="${r * 0.6}"/><circle class="t-leaf" cx="${60 + r * 0.7}" cy="${i >= 4 ? 58 : 62}" r="${r * 0.6}"/>`);
  }
  if (i >= 4) [[44, 40], [72, 34], [58, 58], [80, 56], [38, 60]].forEach(([x, y]) => p.push(`<circle class="t-flower" cx="${x}" cy="${y}" r="3.6"/>`));
  if (i >= 5) [[22, 18], [98, 22], [60, 6]].forEach(([x, y]) => p.push(`<path class="t-star" d="M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y - 1.6} L${x + 2.6} ${y + 1.2} L${x + 3.8} ${y + 5.6} L${x} ${y + 3} L${x - 3.8} ${y + 5.6} L${x - 2.6} ${y + 1.2} L${x - 6} ${y - 1.6} L${x - 1.8} ${y - 1.8} Z"/>`));
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${p.join('')}</svg>`;
}
function pintarChip() {
  const e = etapa(yo.semillas);
  $('#treeChip').innerHTML = `${arbolSVG(e.i)}<span><b>${yo.semillas}</b><small>semillas · ${e.nombre}</small></span>`;
}
let tAviso;
function aviso(txt) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = txt; el.hidden = false;
  clearTimeout(tAviso); tAviso = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Ambientes de cada semana: figuras y colores propios ---------- */
const MOTIVOS = {
  corazon: (c) => `<path fill="${c}" d="M50 84C20 62 8 46 18 29 26 16 42 18 50 33 58 18 74 16 82 29 92 46 80 62 50 84Z"/>`,
  estrella: (c) => `<path fill="${c}" d="M50 7 61 38H94L67 57 77 90 50 70 23 90 33 57 6 38H39Z"/>`,
  arco: () => '<g fill="none" stroke-width="9" stroke-linecap="round"><path stroke="#F47C20" d="M12 80a38 38 0 0 1 76 0"/><path stroke="#F5C518" d="M24 80a26 26 0 0 1 52 0"/><path stroke="#3E9B5F" d="M36 80a14 14 0 0 1 28 0"/></g>',
  nube: (c) => `<path fill="${c}" d="M26 74a18 18 0 0 1 2-36 22 22 0 0 1 41-6 17 17 0 0 1 10 42Z"/>`,
  arbol: () => '<rect x="45" y="56" width="10" height="34" rx="3" fill="#8A5A2B"/><circle cx="50" cy="40" r="28" fill="#3E9B5F"/><circle cx="30" cy="54" r="15" fill="#3E9B5F"/><circle cx="70" cy="54" r="15" fill="#3E9B5F"/>',
  hoja: (c) => `<path fill="${c}" d="M14 86C14 44 46 14 88 12 88 54 60 86 14 86Z"/><path d="M18 82 80 18" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`,
  casa: (c) => `<path fill="${c}" d="M12 50 50 16 88 50V88H12Z"/><rect x="40" y="58" width="20" height="30" rx="3" fill="#fff" fill-opacity=".6"/>`,
  sol: () => '<g stroke="#F5C518" stroke-width="7" stroke-linecap="round"><path d="M50 4v14M50 82v14M4 50h14M82 50h14M17 17l10 10M73 73l10 10M83 17 73 27M27 73 17 83"/></g><circle cx="50" cy="50" r="22" fill="#F5C518"/>',
  circulo: (c) => `<circle cx="50" cy="50" r="38" fill="${c}"/>`,
  rueda: (c) => `<g fill="none" stroke="${c}" stroke-width="7"><circle cx="50" cy="50" r="38"/><path d="M50 12v76M12 50h76M23 23l54 54M77 23 23 77"/></g><circle cx="50" cy="50" r="8" fill="${c}"/>`,
  marco: (c) => `<rect x="10" y="14" width="80" height="72" rx="4" fill="none" stroke="${c}" stroke-width="8"/><path d="M22 74 40 50 54 64 64 54 78 74Z" fill="${c}"/>`,
  huella: (c) => `<g fill="${c}"><ellipse cx="50" cy="66" rx="20" ry="17"/><circle cx="24" cy="40" r="9"/><circle cx="40" cy="26" r="9"/><circle cx="60" cy="26" r="9"/><circle cx="76" cy="40" r="9"/></g>`,
  montana: () => '<path fill="#3E9B5F" d="M4 88 36 34 56 62 70 44 96 88Z"/><path fill="#fff" fill-opacity=".8" d="M36 34 44 48 36 44 29 46Z"/>',
  ola: (c) => `<path fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" d="M6 40q11-14 22 0t22 0 22 0 22 0M6 66q11-14 22 0t22 0 22 0 22 0"/>`,
  pez: (c) => `<ellipse cx="44" cy="50" rx="30" ry="18" fill="${c}"/><path fill="${c}" d="M70 50 94 32V68Z"/><circle cx="30" cy="45" r="4" fill="#fff"/>`,
  burbuja: (c) => `<g fill="none" stroke="${c}" stroke-width="5"><circle cx="40" cy="58" r="22"/><circle cx="72" cy="28" r="12"/></g>`,
  luna: () => '<path fill="#F5C518" d="M62 10A40 40 0 1 0 90 74 32 32 0 1 1 62 10Z"/>',
  dino: (c) => `<path fill="${c}" d="M8 72Q18 44 44 47Q58 20 76 24Q90 28 86 40Q76 42 71 50L73 80H63L60 66H40L38 80H28L27 68Q16 74 8 72Z"/><circle cx="78" cy="31" r="3" fill="#fff"/>`,
  volcan: () => '<path fill="#8A5A2B" d="M8 90 40 34H60L92 90Z"/><path fill="#F47C20" d="M40 34Q50 14 60 34Z"/>',
  planeta: (c) => `<circle cx="50" cy="50" r="24" fill="${c}"/><ellipse cx="50" cy="52" rx="44" ry="11" fill="none" stroke="#F5C518" stroke-width="5" transform="rotate(-18 50 52)"/>`,
  cohete: (c) => `<path fill="${c}" d="M50 6Q70 30 65 66H35Q30 30 50 6Z"/><circle cx="50" cy="38" r="8" fill="#fff"/><path fill="#F47C20" d="M35 66 22 84 38 76ZM65 66 78 84 62 76ZM42 70H58L50 94Z"/>`,
  flor: (c) => `<g fill="${c}"><circle cx="50" cy="26" r="15"/><circle cx="74" cy="44" r="15"/><circle cx="64" cy="72" r="15"/><circle cx="36" cy="72" r="15"/><circle cx="26" cy="44" r="15"/></g><circle cx="50" cy="50" r="12" fill="#F5C518"/>`,
  mariposa: (c) => `<g fill="${c}"><ellipse cx="30" cy="38" rx="20" ry="16"/><ellipse cx="70" cy="38" rx="20" ry="16"/><ellipse cx="34" cy="66" rx="14" ry="12"/><ellipse cx="66" cy="66" rx="14" ry="12"/></g><rect x="47" y="26" width="6" height="52" rx="3" fill="#1A2D7A"/>`,
};
const TEMAS = {
  emociones: { a: '#FDE3EE', b: '#E7EEFF', m: ['arco', 'corazon', 'estrella', 'nube'], c: ['#F47C20', '#E2557D', '#F5C518'] },
  bosque: { a: '#E1F2DD', b: '#F3F9E8', m: ['arbol', 'hoja', 'hoja', 'mariposa'], c: ['#3E9B5F', '#7BBF5A', '#F5C518'] },
  familia: { a: '#FFEFD8', b: '#E8F5E6', m: ['casa', 'arbol', 'corazon', 'sol'], c: ['#F47C20', '#E2557D', '#3E9B5F'] },
  cuerpo: { a: '#E6F1FF', b: '#FFF2DC', m: ['estrella', 'sol', 'circulo', 'corazon'], c: ['#F47C20', '#4C6FD8', '#F5C518'] },
  ruedas: { a: '#E6EFFF', b: '#FFF4DC', m: ['rueda', 'nube', 'sol', 'rueda'], c: ['#1A2D7A', '#F47C20', '#4C6FD8'] },
  museo: { a: '#F0E8FF', b: '#FFF5E4', m: ['marco', 'estrella', 'marco', 'circulo'], c: ['#8A5ACF', '#F47C20', '#F5C518'] },
  amigos: { a: '#FFEDE2', b: '#E5F5FF', m: ['corazon', 'estrella', 'nube', 'sol'], c: ['#F47C20', '#E2557D', '#4C9BD8'] },
  grupos: { a: '#ECE8FF', b: '#E3F8EF', m: ['circulo', 'estrella', 'circulo', 'corazon'], c: ['#4C6FD8', '#3E9B5F', '#F47C20'] },
  animales: { a: '#ECF6E0', b: '#FFF2E0', m: ['huella', 'hoja', 'mariposa', 'huella'], c: ['#8A5A2B', '#3E9B5F', '#F47C20'] },
  pais: { a: '#E3F3E8', b: '#FFF6DC', m: ['montana', 'sol', 'nube', 'flor'], c: ['#3E9B5F', '#F5C518', '#F47C20'] },
  oceano: { a: '#DDF1FA', b: '#E3FAF4', m: ['ola', 'pez', 'burbuja', 'pez'], c: ['#2F8FC6', '#22A699', '#F47C20'] },
  noche: { a: '#E3E6FA', b: '#EFEAFF', m: ['luna', 'estrella', 'nube', 'estrella'], c: ['#4C6FD8', '#F5C518', '#8A5ACF'] },
  dinosaurios: { a: '#EAF5DF', b: '#FFF0DF', m: ['dino', 'hoja', 'volcan', 'dino'], c: ['#3E9B5F', '#7BBF5A', '#F47C20'] },
  espacio: { a: '#E1E5FA', b: '#EFE6FF', m: ['planeta', 'estrella', 'cohete', 'estrella'], c: ['#8A5ACF', '#4C6FD8', '#F47C20'] },
  jardin: { a: '#E6F6E3', b: '#FFF4E6', m: ['flor', 'mariposa', 'hoja', 'flor'], c: ['#E2557D', '#F47C20', '#3E9B5F'] },
};
const tema = (t) => TEMAS[t] || TEMAS.jardin;
const hashStr = (s) => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
function motivo(nombre, color, x, y, tam, giro) {
  return `<svg class="motivo" viewBox="0 0 100 100" style="left:${x}%;top:${y}%;width:${tam}px;transform:translate(-50%,-50%) rotate(${giro}deg)" aria-hidden="true">${MOTIVOS[nombre](color)}</svg>`;
}
function decorHoja(t, semilla) {
  const T = tema(t); const h = hashStr(semilla);
  const pos = [[6, 6], [94, 7], [5, 95], [95, 94]];
  return `<div class="deco" aria-hidden="true">${pos.map(([x, y], k) => motivo(T.m[(h + k) % T.m.length], T.c[(h >> k) % T.c.length], x, y, 54 + ((h >> (k * 3)) % 34), ((h >> k) % 50) - 25)).join('')}</div>`;
}
function fondoTema(t) {
  const T = tema(t);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260"><g opacity=".16">
    <g transform="translate(18 20) scale(.62) rotate(-12 50 50)">${MOTIVOS[T.m[0]](T.c[0])}</g>
    <g transform="translate(150 40) scale(.48) rotate(14 50 50)">${MOTIVOS[T.m[1]](T.c[1])}</g>
    <g transform="translate(70 150) scale(.56) rotate(8 50 50)">${MOTIVOS[T.m[2]](T.c[2])}</g>
    <g transform="translate(190 170) scale(.4) rotate(-20 50 50)">${MOTIVOS[T.m[3]](T.c[0])}</g></g></svg>`;
  document.body.style.setProperty('--tema-a', T.a);
  document.body.style.setProperty('--tema-b', T.b);
  document.body.style.setProperty('--tema-patron', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  document.body.dataset.tema = t || 'jardin';
}

/* ---------- Libro protegido: se pide una página a la vez ---------- */
const SAL = 'JardinMagico-CENTEC-lectura-en-pantalla';
function decodificar({ n, d }) {
  const bin = atob(d); const bytes = new Uint8Array(bin.length);
  const llave = new TextEncoder().encode(n + SAL);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ llave[i % llave.length] ^ ((i * 31) & 255);
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function api(ruta) {
  const r = await fetch('./api/libro/' + ruta, { headers: { 'x-jardin': 'lector' }, credentials: 'same-origin' });
  if (!r.ok) throw new Error('libro ' + r.status);
  return decodificar(await r.json());
}
const cachePaginas = new Map();
function traerPagina(id) {
  if (!cachePaginas.has(id)) cachePaginas.set(id, api('pagina/' + id).catch((e) => { cachePaginas.delete(id); throw e; }));
  return cachePaginas.get(id);
}

/* ---------- Voz del Guardián: narración para niños ----------
   Motor principal: voz neuronal en español generada en el servidor (/api/voz, Aura-2 de Cloudflare),
   reproducida con Web Audio y volumen reforzado. Respaldo: la voz del navegador. */
const AC = window.AudioContext || window.webkitAudioContext;
const VOZ_NARRADORA = 'celeste'; // colombiana, clara y entusiasta
const VOZ_GUARDIAN = 'sirio';    // barítono calmado: el Guardián de los Colores
const voz = { disponible: !!AC || 'speechSynthesis' in window, motor: AC ? 'nube' : 'navegador', activa: false, gen: 0, ctx: null, salida: null, fuente: null, clips: new Map(), u: null };
function prepararAudio() {
  // Se llama dentro del toque del usuario: así los celulares (iPhone incluido) permiten el sonido.
  if (!AC) return;
  if (!voz.ctx) {
    voz.ctx = new AC();
    const comp = voz.ctx.createDynamicsCompressor();
    comp.threshold.value = -24; comp.knee.value = 12; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.2;
    const gan = voz.ctx.createGain(); gan.gain.value = 2.6; // volumen reforzado, el compresor evita que distorsione
    gan.connect(comp); comp.connect(voz.ctx.destination); voz.salida = gan;
    try { const b = voz.ctx.createBuffer(1, 1, 22050); const f = voz.ctx.createBufferSource(); f.buffer = b; f.connect(voz.ctx.destination); f.start(0); } catch { /* nada */ }
  }
  if (voz.ctx.state === 'suspended') voz.ctx.resume().catch(() => {});
}
// Dirección de locución (equipo de sonido): la voz recibe el texto limpio; en pantalla no cambia nada.
const limpiarHabla = (s) => sinEmoji(s)
  .replace(/^\s*[-•]\s+/, '')
  .replace(/^\s*—\s*/, '')                 // raya que abre un diálogo
  .replace(/\s*—\s*([.,;:!?])/g, '$1')      // raya que cierra un inciso antes de un signo
  .replace(/\s+—\s*|\s*—\s+/g, ', ')        // incisos del narrador: «—dijo Ana—» → «, dijo Ana,»
  .replace(/—/g, ', ')
  .replace(/[«»"“”]/g, '').replace(/…|\.{3,}/g, '...')
  .replace(/,\s*,/g, ',').replace(/,\s*([.!?])/g, '$1').replace(/\s+/g, ' ').trim();
// Pide el audio de un fragmento (se guarda en el servidor; aquí se recuerda mientras la página está abierta).
function bajarClip(texto, quien = VOZ_NARRADORA) {
  const t = limpiarHabla(texto).slice(0, 600);
  const llave = quien + '|' + t;
  if (!voz.clips.has(llave)) {
    if (voz.clips.size > 120) voz.clips.delete(voz.clips.keys().next().value);
    const p = fetch(`./api/voz?v=${quien}&t=${encodeURIComponent(t)}`, { headers: { 'x-jardin': 'lector' } })
      .then(async (r) => { if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(`voz ${r.status} ${j.code || ''} ${j.detalle || ''}`); } return r.arrayBuffer(); })
      .catch((e) => { voz.clips.delete(llave); throw e; });
    voz.clips.set(llave, p);
  }
  return voz.clips.get(llave);
}
async function clip(texto, quien) {
  const ab = await bajarClip(texto, quien);
  return new Promise((ok, mal) => voz.ctx.decodeAudioData(ab.slice(0), ok, (e) => mal(new Error('decodificar: ' + (e?.message || e)))));
}
// Ritmo por grado: más silencio para los más pequeños (la voz no se acelera ni se frena).
const ritmo = () => ({ 'Transición': 1.3, '1.°': 1.15, '2.°': 1, '3.°': 0.9 }[yo.grado] || 1) * (yo.vozLenta ? 1.4 : 1);
function pausaDe(f) {
  if (f.pausa != null) return f.pausa;
  const t = limpiarHabla(f.texto);
  let ms = 380;
  if (/\.\.\.$/.test(t)) ms = 1050;
  else if (/\?$/.test(t)) ms = f.alNino ? 2400 : 700;
  else if (/!$/.test(t)) ms = 480;
  if (f.finParrafo) ms = Math.max(ms, 950);
  return Math.round(ms * ritmo());
}
function tocar(buf, gen) {
  return new Promise((ok) => {
    if (gen !== voz.gen) { ok(); return; }
    const f = voz.ctx.createBufferSource(); f.buffer = buf;
    f.connect(voz.salida); f.onended = () => ok(); voz.fuente = f; f.start();
  });
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
function callar() {
  voz.gen++; voz.activa = false;
  try { voz.fuente?.stop(); } catch { /* ya terminó */ }
  voz.fuente = null;
  try { speechSynthesis.cancel(); } catch { /* nada */ }
  const a = $('audio#vozGrabada'); if (a && !a.paused) a.pause();
  actualizarBotonesVoz(); quitarResaltado(); burbuja(null);
}
function narrar(frases, { alFrase, alFin } = {}) {
  if (!voz.disponible) { aviso('Este navegador no tiene sonido para la voz. Prueba con Chrome o Safari.'); return; }
  callar(); prepararAudio();
  const gen = ++voz.gen; voz.activa = true; actualizarBotonesVoz();
  const fin = () => { if (gen !== voz.gen) return; voz.activa = false; actualizarBotonesVoz(); quitarResaltado(); burbuja(null); alFin?.(); };
  if (voz.motor === 'nube' && voz.ctx) {
    (async () => {
      let i = 0;
      try {
        for (; i < frases.length; i++) {
          if (gen !== voz.gen) return;
          for (let j = i; j < Math.min(i + 4, frases.length); j++) bajarClip(frases[j].texto, frases[j].quien).catch(() => {});
          if (i === 0) aviso('El Guardián se prepara para leer… 🎙️');
          const buf = await clip(frases[i].texto, frases[i].quien);
          if (gen !== voz.gen) return;
          alFrase?.(frases[i], i);
          await tocar(buf, gen);
          if (gen !== voz.gen) return;
          const sig = frases[i + 1];
          await esperar(pausaDe(frases[i]) + (sig && (sig.quien || VOZ_NARRADORA) !== (frases[i].quien || VOZ_NARRADORA) ? 700 : 0));
        }
        fin();
      } catch (e) {
        if (gen !== voz.gen) return;
        diag('nube', String(e?.message || e), { frase: i, de: frases.length, ctx: voz.ctx?.state });
        aviso('La voz del Guardián no respondió; sigo con la voz del navegador.');
        voz.motor = 'navegador'; // el servidor de voz no respondió: sigue la voz del navegador desde donde iba
        narrarNavegador(frases.slice(i), { alFrase: (f, k) => alFrase?.(f, i + k), alFin: fin }, gen);
      }
    })();
  } else narrarNavegador(frases, { alFrase, alFin: fin }, gen);
}
/* Respaldo: voz del navegador, con los arreglos para que no se corte. */
function vocesES() { try { return speechSynthesis.getVoices().filter((v) => /^es\b|^es[-_]/i.test(v.lang)); } catch { return []; } }
function elegirVoz() {
  const vs = vocesES(); if (!vs.length) return null;
  if (yo.vozNombre) { const v = vs.find((x) => x.name === yo.vozNombre); if (v) return v; }
  const nombres = [/Paulina/i, /Sabina/i, /Mónica|Monica|Marisol|Helena|Laura/i, /Natural/i];
  const regiones = [/es[-_]CO/i, /es[-_]MX/i, /es[-_](US|419)/i, /es/i];
  let mejor = vs[0]; let pts = -1;
  for (const v of vs) {
    let p = v.localService ? 40 : 0; // las voces locales no se cortan; las de internet sí
    nombres.forEach((re, k) => { if (re.test(v.name)) p = Math.max(p, p + 30 - k * 6); });
    regiones.forEach((re, k) => { if (re.test(v.lang)) p += 20 - k * 5; });
    if (p > pts) { pts = p; mejor = v; }
  }
  return mejor;
}
let latido = null;
function narrarNavegador(frases, { alFrase, alFin }, gen) {
  if (!('speechSynthesis' in window)) { alFin?.(); return; }
  let i = 0;
  clearInterval(latido);
  // Chrome detiene la voz después de unos segundos si no se «despierta».
  latido = setInterval(() => { if (gen !== voz.gen) { clearInterval(latido); return; } if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); speechSynthesis.resume(); } }, 9000);
  const sig = () => {
    if (gen !== voz.gen) return;
    if (i >= frases.length) { clearInterval(latido); alFin?.(); return; }
    const f = frases[i];
    const u = new SpeechSynthesisUtterance(limpiarHabla(f.texto));
    const v = elegirVoz(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'es-CO';
    u.rate = yo.vozLenta ? 0.75 : 0.92; u.pitch = 1.1; u.volume = 1;
    let listo = false;
    const fin = () => { if (listo || gen !== voz.gen) return; listo = true; i++; setTimeout(sig, f.pausa ?? 250); };
    u.onend = fin; u.onerror = (ev) => { if (i === 0) diag('navegador', 'speechSynthesis: ' + (ev?.error || 'error')); fin(); };
    alFrase?.(f, i);
    voz.u = u; // se guarda: si el navegador lo olvida, la lectura se queda quieta
    // Seguro: si el navegador nunca avisa que terminó, sigue igual.
    setTimeout(() => { if (!listo && gen === voz.gen && !speechSynthesis.speaking) fin(); }, 1500 + limpiarHabla(f.texto).length * 110);
    try { speechSynthesis.speak(u); } catch { fin(); }
  };
  try { speechSynthesis.cancel(); } catch { /* nada */ }
  setTimeout(sig, 60);
}
function diag(etapa, detalle, extra = {}) {
  try { fetch('./api/voz', { method: 'POST', headers: { 'content-type': 'application/json', 'x-jardin': 'lector' }, body: JSON.stringify({ etapa, detalle: String(detalle).slice(0, 400), ...extra, motor: voz.motor, voces: vocesES().length }) }).catch(() => {}); } catch { /* nada */ }
}
window.addEventListener('error', (e) => diag('js', e.message + ' @' + (e.lineno || '')));
window.addEventListener('unhandledrejection', (e) => diag('promesa', e.reason?.message || String(e.reason)));
function decir(texto) { narrar(fragmentar(texto).map((t) => ({ texto: t, quien: VOZ_NARRADORA }))); }
// Fragmentos de una oración, uniendo las muy cortas (Aura-2 entona mejor frases completas).
function fragmentar(texto) {
  const out = [];
  for (const f of frasesDe(texto)) { if (out.length && limpiarHabla(out[out.length - 1]).length < 40) out[out.length - 1] += ' ' + f; else out.push(f); }
  return out;
}
function actualizarBotonesVoz() {
  $$('[data-narrar]').forEach((b) => { b.textContent = voz.activa ? '⏸ Detener' : b.dataset.etq; b.setAttribute('aria-pressed', voz.activa); });
}
function quitarResaltado() { $$('.s.leyendo').forEach((x) => x.classList.remove('leyendo')); }
function burbuja(texto) {
  let b = $('.burbuja');
  if (!texto) { if (b) b.hidden = true; return; }
  if (!b) { b = document.createElement('div'); b.className = 'burbuja'; b.setAttribute('aria-live', 'polite'); document.body.append(b); }
  b.innerHTML = `<span class="burbuja-quien">El Guardián de los Colores</span>${esc(sinEmoji(texto))}`; b.hidden = false;
}
const botonVoz = (texto, etiqueta = '🔊') => `<button class="oir" type="button" data-decir="${esc(sinEmoji(texto))}" aria-label="Escuchar">${etiqueta}</button>`;
document.addEventListener('click', (e) => { const b = e.target.closest('[data-decir]'); if (b) { e.preventDefault(); e.stopPropagation(); decir(b.dataset.decir); } }, true);
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch { /* nada */ } }
if (AC) fetch('./api/voz?estado=1').then((r) => r.json()).then((j) => { if (!j.ok) voz.motor = 'navegador'; }).catch(() => { voz.motor = 'navegador'; });

/* ---------- Datos ---------- */
let marco, medios, indice;
let guardian = { modo: null };
const vista = { pagina: null, hojas: [], hoja: 0, ocupado: false, aprende: null };

async function iniciar() {
  try {
    [marco, medios] = await Promise.all([
      fetch('./data/marco.json').then((r) => r.json()),
      fetch('./data/medios.json').then((r) => r.json()).catch(() => ({ videos: {}, mural: [], audios: {} })),
    ]);
    indice = await api('indice');
  } catch {
    $('#app').innerHTML = '<div class="empty">No pudimos abrir el libro. Revisa tu conexión y recarga la página.</div>';
    return;
  }
  armarSecuencia();
  pintarControles(); pintarChip(); proteger();
  window.addEventListener('hashchange', rutear);
  window.addEventListener('resize', () => { clearTimeout(vista.tr); vista.tr = setTimeout(() => { if (vista.pagina && enLibro()) mostrarPagina(vista.pagina.id, vista.hoja, 0, true); }, 250); });
  rutear();
  iniciarGuardian();
}

/* Secuencia del libro: portada, presentación, portada de cada semana, cuentos y lecturas, fin. */
let secuencia = [];
function armarSecuencia() {
  const U = Object.fromEntries((indice.unidades || []).map((u) => [u.clave, u]));
  secuencia = [{ id: 'portada', tipo: 'portada', titulo: 'Portada' }];
  let actual = null;
  for (const p of indice.paginas) {
    if (p.unidad && p.unidad !== 'intro' && p.unidad !== actual) {
      actual = p.unidad;
      const u = U[p.unidad] || { clave: p.unidad, titulo: null, semanas: p.unidad, tema: 'jardin' };
      secuencia.push({ id: 'u-' + p.unidad, tipo: 'unidad', titulo: u.titulo || `Semanas ${u.semanas}`, unidad: u });
    }
    secuencia.push({ ...p, unidadInfo: U[p.unidad] });
  }
  secuencia.push({ id: 'fin', tipo: 'fin', titulo: 'Fin del libro' });
}
const posDe = (id) => secuencia.findIndex((x) => x.id === id);
const temaDe = (item) => (item.tipo === 'unidad' ? item.unidad?.tema : item.unidadInfo?.tema) || 'jardin';
const etiquetaUnidad = (u) => (u ? (u.clave === 'ce' ? 'Capítulo especial' : `Semanas ${u.semanas}`) : '');

/* ---------- Navegación general ---------- */
function pintarControles() {
  $('#nav').innerHTML = [['libro', '#libro', '📖 Leer el libro'], ['indice', '#indice', 'Índice'], ['competencias', '#competencias', 'Competencias'], ['por-que-leer', '#por-que-leer', 'Por qué leer']]
    .map(([id, href, n]) => `<a href="${href}" data-nav="${id}">${n}</a>`).join('');
  const roles = [['estudiante', 'Estudiante'], ['familia', 'Familia'], ['docente', 'Docente']];
  $('#roles').innerHTML = roles.map(([v, n]) => `<button type="button" data-rol="${v}" aria-pressed="${yo.rol === v}">${n}</button>`).join('');
  $('#roles').onclick = (e) => { const b = e.target.closest('[data-rol]'); if (!b) return; yo.rol = b.dataset.rol; guardar(); pintarControles(); refrescar(); };
  const sel = $('#grado');
  sel.innerHTML = marco.grados.map((g) => `<option ${g === yo.grado ? 'selected' : ''}>${g}</option>`).join('');
  sel.onchange = () => { yo.grado = sel.value; guardar(); refrescar(); };
  $('#treeChip').onclick = () => { location.hash = 'arbol'; };
}
function refrescar() { if (enLibro() && vista.pagina) mostrarPagina(vista.pagina.id, vista.hoja, 0, true); else rutear(); }
function marcarNav(id) { $$('#nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.nav === id ? 'page' : 'false')); }
const enLibro = () => document.body.classList.contains('modo-libro');
function rutear() {
  const h = decodeURIComponent(location.hash.slice(1));
  callar(); cerrarAprende();
  const m = /^libro(?:\/([a-z0-9-]+)(?:\/(\d+))?)?$/.exec(h);
  if (!h || m) {
    document.body.classList.add('modo-libro'); marcarNav('libro');
    let id = m?.[1]; let hoja = m?.[2] ? +m[2] - 1 : 0;
    if (!id) { id = 'portada'; hoja = 0; }
    if (posDe(id) < 0) { id = 'portada'; hoja = 0; }
    mostrarPagina(id, hoja, 0);
    return;
  }
  document.body.classList.remove('modo-libro'); fondoTema('jardin');
  if (h === 'arbol') { marcarNav(''); pintarArbol(); }
  else if (h === 'competencias') { marcarNav('competencias'); pintarCompetencias(); }
  else if (h === 'por-que-leer') { marcarNav('por-que-leer'); pintarPorQueLeer(); }
  else { marcarNav('indice'); pintarIndice(h === 'mural' ? 'mural' : null); }
}

/* ---------- Construcción de una página en bloques ---------- */
function frasesDe(texto) {
  const t = String(texto).trim();
  const partes = t.match(/[^.!?…]+(?:[.!?…]+[»"”')\]]*|$)\s*/g) || [t];
  const out = []; let buf = '';
  for (const p of partes) { buf += p; if (sinEmoji(buf).length >= 3) { out.push(buf); buf = ''; } }
  if (buf) { if (out.length) out[out.length - 1] += buf; else out.push(buf); }
  return out.map((s) => s.trim()).filter(Boolean);
}
function htmlFrase(f, k) {
  const marcas = (f.match(/\*\*/g) || []).length;
  const limpio = marcas % 2 ? f.replace(/\*\*/g, '') : f;
  return `<span class="s" data-k="${k}">${conNegrita(limpio)}</span> `;
}
function bloquesDe(item, p) {
  const B = [];
  const T = item.tipo;
  let k = 0; const habla = [];
  const parrafo = (texto, clase = '') => {
    const lista = /^\s*[-•]\s+/.test(texto); const limpio = texto.replace(/^\s*[-•]\s+/, '');
    const fr = frasesDe(limpio);
    const frases = fr.map((f, n) => { const kk = k++; habla.push({ k: kk, texto: f, fin: n === fr.length - 1 }); return { k: kk, texto: f, html: htmlFrase(f, kk) }; });
    B.push({ tipo: 'p', clase: (lista ? 'li ' : '') + clase, frases });
  };
  if (T === 'portada' || T === 'unidad' || T === 'fin') return { bloques: [{ tipo: 'especial' }], habla };
  B.push({ tipo: 'cabeza', html: cabezaPagina(item, p) });
  (p.parrafos || []).forEach((x) => parrafo(x));
  if (p.ruta) {
    const r = p.ruta; const li = (a) => (a || []).map((x) => `<li>${conNegrita(x)} ${botonVoz(x)}</li>`).join('');
    B.push({ tipo: 'html', html: `<section class="ruta-libro"><h3>🌟 Ruta Lectora CENTEC ${p.rutaCreada ? '<span class="chip rev">nueva</span>' : ''}</h3>
      <h4>📖 Palabras para crecer</h4><ul>${(r.palabras || []).map((w) => `<li><b>${esc(w.palabra)}</b>: ${esc(w.significado)} ${botonVoz(`${w.palabra}: ${w.significado}`)}</li>`).join('')}</ul></section>` });
    if (r.literal?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>🔎 Leo y recuerdo</h4><ul>${li(r.literal)}</ul></section>` });
    if (r.inferencial?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>🤔 Pienso y descubro</h4><ul>${li(r.inferencial)}</ul></section>` });
    if (r.critico?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>💬 Opino y propongo</h4><ul>${li(r.critico)}</ul></section>` });
    if (r.reto) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>🏡 Reto en familia</h4><p>${conNegrita(r.reto)} ${botonVoz(r.reto)}</p></section>` });
  }
  return { bloques: B, habla };
}
function cabezaPagina(item, p) {
  const u = item.unidadInfo;
  const kicker = item.tipo === 'cuento' ? 'Cuento' : item.tipo === 'lectura' ? 'Lectura' : '';
  const narrable = item.tipo === 'cuento' || item.tipo === 'lectura' || item.tipo === 'texto';
  return `<header class="hoja-cabeza">
    <div class="kicker">${esc([etiquetaUnidad(u), kicker].filter(Boolean).join(' · '))}</div>
    <h2 class="page-title">${conNegrita(p.titulo || item.titulo)}</h2>
    ${narrable && voz.disponible ? `<div class="row centro"><button class="btn navy small" type="button" data-narrar data-etq="🔊 Escuchar ${item.tipo === 'texto' ? 'esta página' : 'el cuento'}">🔊 Escuchar ${item.tipo === 'texto' ? 'esta página' : 'el cuento'}</button></div>` : ''}
  </header>`;
}

/* Reparte los bloques en hojas del tamaño de la pantalla, como un libro impreso. */
function medidas() {
  const stage = $('.stage');
  const ancho = stage ? stage.clientWidth : Math.min(780, innerWidth - 32);
  const top = stage ? stage.getBoundingClientRect().top + scrollY : 200;
  const alto = Math.max(430, Math.min(980, innerHeight - Math.max(0, top - scrollY) - 92));
  return { ancho, alto };
}
function paginar(bloques, { ancho, alto, letra = yo.letra }) {
  const medir = document.createElement('div');
  medir.className = 'leaf medir'; medir.style.cssText = `width:${ancho}px;height:${alto}px;--read:${letra}rem`;
  medir.innerHTML = '<div class="leaf-in"></div>';
  document.body.append(medir);
  const dentro = $('.leaf-in', medir);
  const hojas = []; let actual = [];
  const cabe = () => dentro.scrollHeight <= dentro.clientHeight + 1;
  const nueva = () => { hojas.push(actual); actual = []; dentro.innerHTML = ''; };
  const poner = (html) => { dentro.insertAdjacentHTML('beforeend', html); };
  for (const b of bloques) {
    if (b.tipo === 'p') {
      // Un párrafo puede partirse entre hojas por oraciones.
      let pend = b.frases.slice();
      while (pend.length) {
        const ini = dentro.childElementCount;
        poner(`<p class="${b.clase}"></p>`);
        const el = dentro.lastElementChild; const puestas = [];
        let partida = null;
        for (const f of pend) {
          el.insertAdjacentHTML('beforeend', f.html);
          if (!cabe()) {
            el.lastElementChild.remove();
            // Como en un libro impreso: la oración que no cabe se parte por palabras.
            const pal = f.texto.split(/\s+/); let lo = 0; let hi = pal.length - 1;
            while (lo < hi) {
              const mid = Math.ceil((lo + hi) / 2);
              el.insertAdjacentHTML('beforeend', htmlFrase(pal.slice(0, mid).join(' '), f.k));
              const ok = cabe(); el.lastElementChild.remove();
              if (ok) lo = mid; else hi = mid - 1;
            }
            if (lo >= 3) partida = { a: { ...f, texto: pal.slice(0, lo).join(' '), html: htmlFrase(pal.slice(0, lo).join(' '), f.k) }, b: { ...f, texto: pal.slice(lo).join(' '), html: htmlFrase(pal.slice(lo).join(' '), f.k) } };
            break;
          }
          puestas.push(f);
        }
        if (partida) { const idx = puestas.length; puestas.push(partida.a); pend = [...pend.slice(0, idx), partida.a, partida.b, ...pend.slice(idx + 1)]; }
        if (puestas.length) { actual.push(`<p class="${b.clase}">${puestas.map((f) => f.html).join('')}</p>`); pend = pend.slice(puestas.length); if (pend.length) nueva(); }
        else { el.remove(); if (ini === 0) { actual.push(`<p class="${b.clase}">${pend[0].html}</p>`); pend = pend.slice(1); } nueva(); }
      }
    } else {
      const html = b.html || '';
      poner(html);
      if (!cabe()) {
        dentro.lastElementChild.remove();
        if (actual.length) { nueva(); poner(html); }
        actual.push(html);
        if (!cabe()) nueva();
      } else actual.push(html);
    }
  }
  if (actual.length) hojas.push(actual);
  medir.remove();
  return hojas.map((h) => h.join(''));
}

/* ---------- Mostrar una página del libro ---------- */
async function mostrarPagina(id, hoja = 0, dir = 0, rapido = false) {
  const pos = posDe(id); const item = secuencia[pos];
  fondoTema(temaDe(item));
  if (!$('.stage')) montarEscenario();
  let p = null;
  if (['cuento', 'lectura', 'texto'].includes(item.tipo)) {
    try { p = await traerPagina(id); } catch { $('.stage').innerHTML = '<div class="leaf"><div class="leaf-in"><div class="empty">No pudimos traer esta página. Revisa la conexión.</div></div></div>'; return; }
  }
  const { bloques, habla } = bloquesDe(item, p || {});
  let hojas;
  if (bloques[0]?.tipo === 'especial') { hojas = [htmlEspecial(item)]; vista.letraHoja = yo.letra; }
  else {
    const med = medidas();
    hojas = paginar(bloques, med);
    const n = hojas.length;
    // Estética, como en el libro impreso: cada cuento toma el tamaño de letra más grande con el que
    // sigue cabiendo en el mismo número de hojas, y luego el texto se reparte parejo entre ellas.
    let letra = yo.letra; let lo = yo.letra; let hi = yo.letra * 1.22;
    for (let i = 0; i < 5; i++) {
      const mid = (lo + hi) / 2; const prueba = paginar(bloques, { ...med, letra: mid });
      if (prueba.length === n) { letra = mid; hojas = prueba; lo = mid; } else hi = mid;
    }
    if (n > 1) {
      let a = Math.round(med.alto * 0.6); let b = med.alto;
      for (let i = 0; i < 5 && b - a > 12; i++) {
        const mid = Math.round((a + b) / 2); const prueba = paginar(bloques, { ...med, alto: mid, letra });
        if (prueba.length === n) { hojas = prueba; b = mid; } else a = mid;
      }
    }
    vista.letraHoja = letra;
    if (item.tipo === 'cuento' || item.tipo === 'lectura') hojas.push('__aprende__');
  }
  if (hoja < 0) hoja = hojas.length - 1;
  hoja = Math.max(0, Math.min(hojas.length - 1, hoja));
  Object.assign(vista, { pagina: { id, item, datos: p, habla, pos }, hojas, hoja });
  yo.pos = { id, hoja }; guardar();
  history.replaceState(null, '', `#libro/${id}/${hoja + 1}`);
  pintarHoja(dir, rapido);
  if (voz.motor === 'nube' && (item.tipo === 'cuento' || item.tipo === 'lectura') && p) {
    if (p.voz?.intro) fragmentar(p.voz.intro).slice(0, 2).forEach((t) => bajarClip(t, VOZ_GUARDIAN).catch(() => {}));
    bajarClip((p.titulo || item.titulo).replace(/[.!?]*$/, '.')).catch(() => {});
  }
  // Adelanta la página siguiente para que pasar sea instantáneo.
  const sig = secuencia[pos + 1]; if (sig && ['cuento', 'lectura', 'texto'].includes(sig.tipo)) traerPagina(sig.id).catch(() => {});
}
function montarEscenario() {
  $('#app').innerHTML = `
    <div class="libro">
      <button class="flecha izq" type="button" data-ir="-1" aria-label="Página anterior">‹</button>
      <div class="stage" aria-live="polite"></div>
      <button class="flecha der" type="button" data-ir="1" aria-label="Página siguiente">›</button>
    </div>
    <div class="barra">
      <button class="btn ghost small" type="button" data-ir="-1">← Anterior</button>
      <div class="donde" id="donde"></div>
      <button class="btn small" type="button" data-ir="1">Siguiente →</button>
    </div>
    <div class="herramientas">
      <button class="btn ghost small" type="button" id="letraMenos" aria-label="Letra más pequeña">A−</button>
      <button class="btn ghost small" type="button" id="letraMas" aria-label="Letra más grande">A+</button>
      <button class="btn ghost small" type="button" id="ajusteVoz">${yo.vozLenta ? '🐢 Voz lenta' : '🙂 Voz normal'}</button>
      <a class="btn ghost small" href="#indice">☰ Índice</a>
    </div>
    <p class="legal">© 2025 Editorial Pluma de Oro S.A.S. · Lectura en pantalla. Prohibida su copia, descarga o impresión.</p>`;
  const app = $('#app');
  app.onclick = (e) => {
    const ir = e.target.closest('[data-ir]'); if (ir) { pasar(+ir.dataset.ir); return; }
    const n = e.target.closest('[data-narrar]'); if (n) { if (voz.activa) callar(); else narrarPagina(); return; }
    const a = e.target.closest('[data-aprende]'); if (a) { abrirAprende(a.dataset.aprende); return; }
    if (e.target.id === 'letraMas' || e.target.id === 'letraMenos') { yo.letra = Math.max(1, Math.min(1.7, yo.letra + (e.target.id === 'letraMas' ? 0.1 : -0.1))); guardar(); mostrarPagina(vista.pagina.id, vista.hoja, 0, true); return; }
    if (e.target.id === 'ajusteVoz') { yo.vozLenta = !yo.vozLenta; guardar(); e.target.textContent = yo.vozLenta ? '🐢 Voz lenta' : '🙂 Voz normal'; decir(yo.vozLenta ? 'Voy a leer despacito.' : 'Voy a leer normal.'); return; }
    // Tocar el borde de la hoja: derecha avanza, izquierda devuelve.
    const st = e.target.closest('.stage');
    if (st && !e.target.closest('button,a,input,textarea,select,label,.ruta-libro li,.aprende-hoja')) {
      const r = st.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width;
      if (x > 0.74) pasar(1); else if (x < 0.26) pasar(-1);
    }
  };
  // Deslizar de derecha a izquierda pasa la página; de izquierda a derecha la devuelve.
  const st = $('.stage'); let ini = null;
  st.addEventListener('pointerdown', (e) => { ini = { x: e.clientX, y: e.clientY, t: Date.now() }; });
  st.addEventListener('pointerup', (e) => {
    if (!ini) return; const dx = e.clientX - ini.x; const dy = e.clientY - ini.y; ini = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { vista.saltarClic = true; pasar(dx < 0 ? 1 : -1); }
  });
  st.addEventListener('click', (e) => { if (vista.saltarClic) { vista.saltarClic = false; e.stopPropagation(); } }, true);
}
function pintarHoja(dir, rapido) {
  const st = $('.stage'); const { item } = vista.pagina;
  const { alto } = medidas(); st.style.height = alto + 'px';
  const html = vista.hojas[vista.hoja] === '__aprende__' ? htmlAprendeHoja() : vista.hojas[vista.hoja];
  const leaf = document.createElement('div');
  leaf.className = 'leaf' + (item.tipo === 'portada' || item.tipo === 'unidad' || item.tipo === 'fin' ? ' especial' : '');
  leaf.style.setProperty('--read', (vista.letraHoja || yo.letra) + 'rem');
  const folio = item.tipo === 'portada' ? '' : `<div class="folio">${esc(item.titulo).slice(0, 48)} · ${vista.hoja + 1}/${vista.hojas.length}</div>`;
  leaf.innerHTML = `${decorHoja(temaDe(item), item.id + vista.hoja)}<div class="leaf-in${vista.hojas[vista.hoja] === '__aprende__' || /especial/.test(leaf.className) ? ' scroll' : ''}">${html}</div>${folio}`;
  const vieja = $('.leaf:not(.saliendo)', st);
  if (!vieja || rapido || !dir || reducido()) { st.innerHTML = ''; st.append(leaf); }
  else if (dir > 0) {
    // La hoja actual gira hacia la izquierda y deja ver la siguiente.
    st.insertBefore(leaf, vieja); vieja.classList.add('saliendo', 'pasa');
    vista.ocupado = true; vieja.addEventListener('animationend', () => { vieja.remove(); vista.ocupado = false; }, { once: true });
  } else {
    // La hoja anterior vuelve desde la izquierda y cubre la actual.
    st.append(leaf); leaf.classList.add('vuelve'); vieja.classList.add('saliendo');
    vista.ocupado = true; leaf.addEventListener('animationend', () => { leaf.classList.remove('vuelve'); vieja.remove(); vista.ocupado = false; }, { once: true });
  }
  setTimeout(() => { vista.ocupado = false; }, 900);
  const u = item.tipo === 'unidad' ? item.unidad : item.unidadInfo;
  $('#donde').innerHTML = `<b>${esc(item.titulo).slice(0, 60)}</b><small>${esc(etiquetaUnidad(u))}${u ? ' · ' : ''}Hoja ${vista.hoja + 1} de ${vista.hojas.length} · Página ${vista.pagina.pos} de ${secuencia.length - 1}</small>`;
  $$('[data-ir="-1"]').forEach((b) => { b.disabled = vista.pagina.pos === 0 && vista.hoja === 0; });
  $$('[data-ir="1"]').forEach((b) => { b.disabled = vista.pagina.pos === secuencia.length - 1 && vista.hoja === vista.hojas.length - 1; });
  if (vista.hojas[vista.hoja] === '__aprende__' && !yo.leidos[item.id]) { yo.leidos[item.id] = true; guardar(); sumar(1, 'leido-' + item.id); }
  actualizarBotonesVoz();
  if (voz.activa && vista.resaltar != null) resaltar(vista.resaltar);
}
async function pasar(d) {
  if (vista.ocupado || !vista.pagina) return;
  if (voz.activa && !vista.pasoPorVoz) callar();
  const h = vista.hoja + d;
  if (h >= 0 && h < vista.hojas.length) {
    vista.hoja = h; yo.pos = { id: vista.pagina.id, hoja: h }; guardar();
    history.replaceState(null, '', `#libro/${vista.pagina.id}/${h + 1}`);
    pintarHoja(d); verLibro(); return;
  }
  const destino = secuencia[vista.pagina.pos + d]; if (!destino) return;
  await mostrarPagina(destino.id, d > 0 ? 0 : -1, d); verLibro();
}
function verLibro() { const st = $('.stage'); if (!st) return; const r = st.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) st.scrollIntoView({ block: 'nearest', behavior: reducido() ? 'auto' : 'smooth' }); }
document.addEventListener('keydown', (e) => {
  if (!enLibro() || e.target.closest('input,textarea,select') || $('.modal:not([hidden])')) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); pasar(1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); pasar(-1); }
});

/* Narración de la página completa: el Guardián lee, resalta la oración y pasa las hojas solo. */
function narrarPagina() {
  const { datos, habla, item } = vista.pagina;
  diag('narrar', 'inicio', { id: item.id, frases: habla.length, activa: voz.activa });
  if (!habla.length) return;
  const audio = medios.audios?.[item.id];
  if (audio) {
    // Voz grabada por un docente de CENTEC: tiene prioridad sobre la voz del navegador.
    let a = $('audio#vozGrabada'); if (!a) { a = document.createElement('audio'); a.id = 'vozGrabada'; a.controlsList = 'nodownload'; document.body.append(a); }
    if (!a.paused) { a.pause(); actualizarBotonesVoz(); return; }
    a.src = audio; a.play().catch(() => aviso('No se pudo reproducir la grabación.'));
    return;
  }
  const frases = [];
  if (datos?.voz?.intro) fragmentar(datos.voz.intro).forEach((t, n, a) => frases.push({ texto: t, guardian: true, quien: VOZ_GUARDIAN, alNino: true, pausa: n === a.length - 1 ? Math.round(900 * ritmo()) : undefined }));
  frases.push({ texto: (datos?.titulo || item.titulo).replace(/[.!?]*$/, '.'), pausa: Math.round(1200 * ritmo()) });
  // Empieza en la hoja visible.
  const enHoja = (k) => vista.hojas.findIndex((h) => h !== '__aprende__' && h.includes(`data-k="${k}"`));
  const primero = habla.find((f) => enHoja(f.k) >= vista.hoja) || habla[0];
  habla.filter((f) => f.k >= primero.k).forEach((f) => frases.push({ texto: f.texto, k: f.k, finParrafo: f.fin }));
  if (datos?.voz?.cierre) { frases[frases.length - 1].pausa = Math.round(1500 * ritmo()); fragmentar(datos.voz.cierre).forEach((t) => frases.push({ texto: t, guardian: true, quien: VOZ_GUARDIAN, alNino: true })); }
  narrar(frases, {
    alFrase: (f) => {
      if (f.guardian) { quitarResaltado(); burbuja(f.texto); return; }
      burbuja(null);
      if (f.k == null) return;
      vista.resaltar = f.k;
      const h = enHoja(f.k);
      if (h >= 0 && h !== vista.hoja) { vista.pasoPorVoz = true; vista.hoja = h; history.replaceState(null, '', `#libro/${item.id}/${h + 1}`); pintarHoja(1); vista.pasoPorVoz = false; }
      resaltar(f.k);
    },
    alFin: () => { vista.resaltar = null; },
  });
}
function resaltar(k) {
  quitarResaltado();
  const partes = $$(`.leaf:not(.saliendo) .s[data-k="${k}"]`); const s = partes[0]; if (!s) return;
  partes.forEach((x) => x.classList.add('leyendo'));
  const box = s.closest('.leaf-in'); const r = s.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight) s.scrollIntoView({ block: 'center', behavior: reducido() ? 'auto' : 'smooth' });
  void box;
}

/* ---------- Hojas especiales: portada, portada de cada semana y fin ---------- */
function htmlEspecial(item) {
  if (item.tipo === 'portada') {
    const sigue = yo.pos && yo.pos.id !== 'portada' && posDe(yo.pos.id) > 0;
    const primero = secuencia[1]?.id;
    return `<div class="cover">
      <svg class="cover-art" viewBox="0 0 220 150" aria-hidden="true">
        <ellipse class="t-ground" cx="110" cy="138" rx="90" ry="10"/>
        <path class="t-trunk" d="M102 138 L104 88 Q110 78 116 88 L118 138 Z"/>
        <circle class="t-leaf" cx="110" cy="66" r="42"/><circle class="t-leaf" cx="76" cy="84" r="24"/><circle class="t-leaf" cx="144" cy="84" r="24"/>
        <circle class="t-flower" cx="92" cy="58" r="5"/><circle class="t-flower" cx="128" cy="50" r="5"/><circle class="t-flower" cx="112" cy="80" r="5"/><circle class="t-flower" cx="146" cy="78" r="4"/><circle class="t-flower" cx="76" cy="82" r="4"/>
        <path class="t-star" d="M30 18 l3 7 7 .5 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.5z"/>
        <path class="t-star" d="M190 26 l3 7 7 .5 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.5z"/>
      </svg>
      <div class="eyebrow-ink">Colegio CENTEC Córdoba · Cali</div>
      <h2 class="cover-title">El Jardín <span>Mágico</span> del Saber</h2>
      <p class="cover-sub">Cuentos y lecturas para aprender en familia · Transición a 3.°</p>
      <p class="autores">Alexander Rojas Zamorano · Paula Andrea Rojas Cairasco · Daniela Rojas Cairasco</p>
      <div class="row centro" style="margin-top:18px">
        ${sigue ? `<a class="btn" href="#libro/${yo.pos.id}/${(yo.pos.hoja || 0) + 1}">Seguir donde quedé →</a><a class="btn ghost" href="#libro/${primero}/1">Empezar desde el inicio</a>` : `<a class="btn" href="#libro/${primero}/1">Empezar a leer →</a>`}
        <a class="btn ghost" href="#indice">Índice</a>
      </div>
      <p class="pista-pasar">Para pasar la hoja, desliza de derecha a izquierda o toca el borde derecho. Para volver, al revés.</p>
      <p class="legal">© 2025 Editorial Pluma de Oro S.A.S. · Libro de lectura en pantalla.</p>
    </div>`;
  }
  if (item.tipo === 'unidad') {
    const u = item.unidad; const T = tema(u.tema);
    const piezas = secuencia.filter((x) => x.unidad === u.clave && x.tipo !== 'unidad');
    const arte = [[18, 22], [82, 20], [12, 74], [88, 76], [50, 12]].map(([x, y], k) => motivo(T.m[k % T.m.length], T.c[k % T.c.length], x, y, 70 + (k % 2) * 24, (k * 17) % 40 - 20)).join('');
    return `<div class="cover unidad-cover"><div class="arte-unidad" aria-hidden="true">${arte}</div>
      <div class="kicker">${esc(etiquetaUnidad(u))}</div>
      <h2 class="cover-title unidad-titulo">${esc(u.titulo || etiquetaUnidad(u))}</h2>
      <ol class="toc">${piezas.map((x) => `<li><a href="#libro/${x.id}/1">${esc(x.titulo)}</a><span>${x.tipo === 'cuento' ? 'Cuento' : 'Lectura'}${yo.leidos[x.id] ? ' ✓' : ''}</span></li>`).join('')}</ol>
    </div>`;
  }
  const leidos = Object.keys(yo.leidos).length; const total = secuencia.filter((x) => x.tipo === 'cuento' || x.tipo === 'lectura').length;
  return `<div class="cover"><div class="kicker">Fin del libro</div><h2 class="page-title">¡Llegaste al final del Jardín! 🌟</h2>
    <p class="cover-sub">Has leído ${leidos} de ${total} cuentos y lecturas. Cada uno es una semilla en tu Árbol del Saber.</p>
    <div class="row centro" style="margin-top:16px"><a class="btn" href="#arbol">Ver mi árbol</a><a class="btn ghost" href="#indice">Índice</a><a class="btn ghost" href="#libro/portada/1">Volver a la portada</a></div></div>`;
}

/* ---------- Aprender con el cuento: guía según quién lee ---------- */
function htmlAprendeHoja() {
  const { datos: p, item } = vista.pagina; const g = p.guiaFamilia; const d = p.guiaDocente;
  const botones = [['jugar', '🎮', 'Jugar', 'Preguntas para comprobar lo que entendí'], ['pensar', '💭', 'Pensar', 'Dar mi opinión con razones'], ['crecer', '💛', 'Crecer', 'Emoción, valor, disciplina e inventos'], ['reinventar', '✏️', 'Reinventar', 'Crear mi propia versión']];
  let guia = '';
  if (yo.rol === 'familia' && g?.pasos?.length) {
    guia = `<div class="guia-rol"><h3>Para acompañar en casa ${botonVoz('Para acompañar en casa. ' + g.pasos.map((x, i) => `Paso ${i + 1}. ${x}`).join(' '), '🔊 Escuchar los pasos')}</h3>
      <ol class="pasos">${g.pasos.map((x) => `<li><span>${esc(x)}</span>${botonVoz(x)}</li>`).join('')}</ol>
      <p class="hint">No hace falta leer bien: toquen 🔊 y escuchen juntos. Sesiones cortas, de 10 a 15 minutos.</p></div>`;
  } else if (yo.rol === 'docente' && d) {
    const comp = (p.brujula?.competencias || []).map((id) => marco.competencias.lista.find((x) => x.id === id)).filter(Boolean);
    guia = `<div class="guia-rol"><h3>Guía docente <span class="chip rev">en revisión</span></h3>
      <p><b>Propósito:</b> ${esc(d.proposito)}</p>
      <p><b>Actividad de aula:</b> ${esc(d.actividad)}</p>
      <p><b>Error frecuente:</b> ${esc(d.errorFrecuente)}</p>
      ${comp.length ? `<p><b>Siembra en ${esc(yo.grado)}:</b></p><ul class="seeds">${comp.map((k) => `<li><b>${esc(k.nombre)}.</b> ${esc(k.semillas[yo.grado] || '')}</li>`).join('')}</ul>` : ''}
      <p class="hint">DBA: por verificar con el docente de Lenguaje del grado.</p></div>`;
  } else {
    const tip = yo.grado === 'Transición' ? 'Pide a un adulto que juegue contigo. Toca 🔊 para escuchar cada pregunta.' : 'Elige un juego. Si una pregunta es difícil, vuelve a leer el cuento: el error nos enseña.';
    guia = `<div class="guia-rol"><h3>¡Ahora aprende jugando! ${botonVoz(tip)}</h3><p>${esc(tip)}</p></div>`;
  }
  return `<div class="aprende-hoja"><div class="kicker">Aprende con este cuento</div><h2 class="page-title">${esc(item.titulo)}</h2>
    ${yo.rol !== 'estudiante' ? guia : ''}
    <div class="grid-aprende">${botones.map(([id, ic, n, s]) => `<button class="tarjeta-aprende${yo.hechas[`${id}-${item.id}`] ? ' hecha' : ''}" type="button" data-aprende="${id}"><span class="ic">${ic}</span><b>${n}</b><small>${s}</small></button>`).join('')}</div>
    ${yo.rol === 'estudiante' ? guia : ''}
    ${medios.videos?.[item.id] ? `<p><a class="btn ghost small" href="${esc(medios.videos[item.id])}" target="_blank" rel="noopener">🎬 Ver el videoclip</a></p>` : ''}
  </div>`;
}
function abrirAprende(tab) {
  vista.aprende = { tab, q: 0, intento: 0, consigna: 0 };
  let m = $('.modal');
  if (!m) { m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true"><button class="cerrar" type="button" aria-label="Cerrar">✕</button><div id="panel"></div></div>'; document.body.append(m); m.onclick = (e) => { if (e.target === m || e.target.closest('.cerrar')) cerrarAprende(); }; }
  m.hidden = false; document.body.classList.add('con-modal');
  pintarAprende();
}
function cerrarAprende() { const m = $('.modal'); if (m) { m.hidden = true; document.body.classList.remove('con-modal'); callar(); if (vista.hojas[vista.hoja] === '__aprende__' && enLibro()) pintarHoja(0, true); } }
function pintarAprende() {
  const p = vista.pagina.datos; const t = vista.aprende.tab;
  const tabs = [['jugar', '🎮 Jugar'], ['pensar', '💭 Pensar'], ['crecer', '💛 Crecer'], ['reinventar', '✏️ Reinventar']];
  $('#panel').innerHTML = `<div class="kicker">${esc(p.titulo)}</div><div class="tabs" role="tablist">${tabs.map(([v, n]) => `<button role="tab" type="button" data-tab="${v}" aria-selected="${t === v}">${n}</button>`).join('')}</div><div id="tabcont"></div>`;
  $('#panel .tabs').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; callar(); Object.assign(vista.aprende, { tab: b.dataset.tab, q: 0, intento: 0 }); pintarAprende(); };
  ({ jugar: pJugar, pensar: pPensar, crecer: pCrecer, reinventar: pReinventar })[t](p);
}

/* Jugar */
function orden(q) {
  let h = 0; for (const ch of q.id || q.pregunta) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return q.opciones.map((_, k) => k).sort((a, b) => ((a * 7 + h) % 5) - ((b * 7 + h) % 5) || a - b);
}
function pJugar(p) {
  const qs = (p.preguntas || []).filter((q) => q.tipo === 'opcion').map((q, i) => ({ ...q, id: q.id || `${p.id}-q${i + 1}` }));
  const A = vista.aprende; const box = $('#tabcont');
  if (!qs.length) { box.innerHTML = '<div class="empty">Este cuento todavía no tiene juego.</div>'; return; }
  if (A.q >= qs.length) {
    const buenas = qs.filter((q) => yo.hechas[q.id]).length;
    sumar(1, `jugar-${p.id}`);
    box.innerHTML = `<div class="done-box"><b>${buenas} de ${qs.length}</b><p>¡Terminaste el juego! Ahora pasa a <b>Pensar</b>: allí no hay respuestas únicas, hay buenas razones.</p>
      <div class="row centro"><button class="btn" type="button" id="aPensar">Ir a Pensar</button><button class="btn ghost" type="button" id="otraVez">Jugar otra vez</button></div></div>`;
    $('#aPensar').onclick = () => { A.tab = 'pensar'; pintarAprende(); };
    $('#otraVez').onclick = () => { A.q = 0; A.intento = 0; pintarAprende(); };
    return;
  }
  const q = qs[A.q];
  box.innerHTML = `<div class="quiz">
    <div class="qprog" aria-hidden="true">${qs.map((_, k) => `<i class="${k < A.q ? 'done' : k === A.q ? 'now' : ''}"></i>`).join('')}</div>
    <div class="qlevel">Pregunta ${A.q + 1} de ${qs.length} · ${esc(q.nivel)}</div>
    <p class="qtext">${esc(q.pregunta)} ${botonVoz(q.pregunta + ' ' + q.opciones.map((o, i) => `Opción ${i + 1}: ${o}.`).join(' '))}</p>
    <div class="opts">${orden(q).map((k) => `<div class="opt-fila"><button class="opt" type="button" data-k="${k}">${esc(q.opciones[k])}</button>${botonVoz(q.opciones[k])}</div>`).join('')}</div>
    <div id="fb" aria-live="polite"></div></div>`;
  if (yo.grado === 'Transición' && yo.rol !== 'docente') decir(q.pregunta);
  $('.opts', box).onclick = (e) => {
    const b = e.target.closest('[data-k]'); if (!b || b.disabled) return;
    const k = +b.dataset.k;
    if (k === q.correcta) {
      b.classList.add('right'); $$('.opt', box).forEach((x) => { x.disabled = true; });
      sumar(A.intento === 0 ? 2 : 1, q.id);
      const expl = q.dondeLoDice ? `Así lo dice el cuento: «${sinEmoji(q.dondeLoDice)}»` : (q.porque || '');
      $('#fb').innerHTML = `<div class="fb ok"><b>¡Muy bien!</b> ${esc(expl)} ${botonVoz('¡Muy bien! ' + expl)}
        <div class="row" style="margin-top:10px"><button class="btn small" type="button" id="sig">Siguiente</button></div></div>`;
      $('#sig').onclick = () => { A.q++; A.intento = 0; callar(); pintarAprende(); };
      $('#sig').focus();
    } else {
      A.intento++; b.classList.add('wrong'); b.disabled = true;
      const t = `Casi. El error no nos detiene: nos enseña. ${q.dondeLoDice ? 'Vuelve a mirar el cuento y busca la parte que lo dice.' : 'Piensa en lo que sintieron los personajes y elige otra.'}`;
      $('#fb').innerHTML = `<div class="fb err"><b>Casi.</b> ${esc(t.slice(6))} ${botonVoz(t)}</div>`;
    }
  };
}
/* Pensar */
function pPensar(p) {
  const qs = (p.preguntas || []).filter((q) => q.tipo === 'abierta').map((q, i) => ({ ...q, id: q.id || `${p.id}-a${i + 1}` }));
  const box = $('#tabcont');
  box.innerHTML = `<div class="open">
    ${qs.map((q) => `<div class="card" data-q="${q.id}">
      <div class="qlevel">${esc(q.nivel)}</div>
      <p class="q">${esc(q.pregunta)} ${botonVoz(q.pregunta + '. Pista: ' + q.pista)}</p>
      <p class="hint">Pista: ${esc(q.pista)}</p>
      <textarea aria-label="Tu respuesta" placeholder="${yo.grado === 'Transición' ? 'Cuéntalo en voz alta; un adulto puede escribir lo que dices.' : 'Escribe aquí con tus palabras…'}">${esc(yo.respuestas[q.id] || '')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn small" type="button" data-guardar>Guardar mi respuesta</button>${guardian.modo ? '<button class="btn ghost small" type="button" data-guardian>Que el Guardián me comente</button>' : ''}</div>
      <div data-ai></div></div>`).join('')}
    ${guardian.modo ? `<div class="card"><h3>Nuevas preguntas del Guardián</h3><p class="hint">Preguntas distintas cada vez, a la medida de ${esc(yo.grado)}.</p><button class="btn navy small" type="button" id="nuevas">Pedir 4 preguntas nuevas</button><div id="nuevasOut"></div></div>` : ''}
  </div>`;
  box.onclick = async (e) => {
    const card = e.target.closest('[data-q]');
    if (e.target.matches('[data-guardar]') && card) {
      const id = card.dataset.q; const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso('Escribe un poquito más 🙂'); return; }
      yo.respuestas[id] = txt; guardar(); if (!sumar(2, 'resp-' + id)) aviso('Respuesta guardada');
      sumar(0, `pensar-${p.id}`);
    }
    if (e.target.matches('[data-guardian]') && card) {
      const q = qs.find((x) => x.id === card.dataset.q); const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso('Primero escribe tu respuesta'); return; }
      await comentar(e.target, $('[data-ai]', card), p, q.pregunta, txt);
    }
    if (e.target.id === 'nuevas') {
      const b = e.target; const out = $('#nuevasOut'); b.disabled = true; out.innerHTML = '<p class="hint">El Guardián está pensando…</p>';
      try {
        const lista = await preguntarGuardian({ tarea: 'preguntas', p });
        const arr = Array.isArray(lista) ? lista.filter((x) => x && x.pregunta).slice(0, 6) : [];
        out.innerHTML = arr.length ? `<ol>${arr.map((x) => `<li style="margin-bottom:10px"><span class="qlevel">${esc(x.nivel || '')}</span><br><b>${esc(x.pregunta)}</b> ${botonVoz(x.pregunta)}${x.pista ? `<br><span class="hint">Pista: ${esc(x.pista)}</span>` : ''}</li>`).join('')}</ol>` : '<p class="hint">No llegaron preguntas. Toca otra vez.</p>';
      } catch (err) { out.innerHTML = `<p class="hint">${esc(mensajeError(err))}</p>`; }
      b.disabled = false;
    }
  };
}
async function comentar(btn, box, p, consigna, respuesta) {
  btn.disabled = true;
  box.innerHTML = '<div class="ai"><span class="ai-label">El Guardián</span><span data-t>Está leyendo lo que escribiste…</span></div>';
  const tEl = $('[data-t]', box);
  try {
    const txt = await preguntarGuardian({ tarea: 'comentario', p, consigna, respuesta }, (parcial) => { tEl.textContent = parcial; });
    tEl.textContent = txt; box.insertAdjacentHTML('beforeend', botonVoz(txt, '🔊 Escuchar al Guardián'));
  } catch (err) { tEl.textContent = mensajeError(err); }
  btn.disabled = false;
}
/* Crecer */
function pCrecer(p) {
  const b = p.brujula; const box = $('#tabcont');
  if (!b) { box.innerHTML = '<div class="empty">Pronto.</div>'; return; }
  const hecho = (k) => !!yo.hechas[`crecer-${k}-${p.id}`];
  const accion = (k, txt) => `<button class="btn small ${hecho(k) ? 'ghost' : ''}" type="button" data-hecho="${k}" ${hecho(k) ? 'disabled' : ''}>${hecho(k) ? 'Practicado ✓' : txt}</button>`;
  const comp = (b.competencias || []).map((id) => marco.competencias.lista.find((x) => x.id === id)).filter(Boolean);
  box.innerHTML = `<div class="grow">
    <div class="card g-emo"><div class="qlevel">Mi corazón · Inteligencia emocional</div><h3>${esc(b.emocion.nombre)} ${botonVoz(b.emocion.nombre + '. ' + b.emocion.estrategia)}</h3><p>${esc(b.emocion.estrategia)}</p>
      <label class="hint" for="sentir">¿Cuándo has sentido algo así?</label>
      <textarea id="sentir" style="min-height:80px;margin-top:6px" placeholder="${yo.grado === 'Transición' ? 'Cuéntalo o dibújalo; un adulto puede escribir.' : 'Escribe con tus palabras…'}">${esc(yo.respuestas['sentir-' + p.id] || '')}</textarea>
      <div class="row" style="margin-top:10px">${accion('emocion', 'Guardar y nombrar mi emoción')}</div></div>
    <div class="card g-val"><div class="qlevel">Valor con propósito</div><h3>${esc(b.valor.nombre)} ${botonVoz(b.valor.nombre + '. ' + b.valor.proposito)}</h3><p>${esc(b.valor.proposito)}</p><div class="row">${accion('valor', 'Lo practiqué esta semana')}</div></div>
    <div class="card g-dis"><div class="qlevel">Disciplina</div><p>${esc(b.disciplina)} ${botonVoz(b.disciplina)}</p><div class="row">${accion('disciplina', 'Cumplí mi hábito')}</div></div>
    <div class="card g-inn"><div class="qlevel">Imaginar, crear, innovar</div><p>${esc(b.innovar)} ${botonVoz(b.innovar)}</p><p class="hint" style="margin:0">Dibújalo o constrúyelo y cuéntaselo a tu familia o a tu profe.</p></div>
    <div class="card g-con"><div class="qlevel">Conecta con · ${esc(b.conecta.area)}</div><p style="margin:0">${esc(b.conecta.actividad)} ${botonVoz(b.conecta.actividad)}</p></div>
    ${comp.length ? `<div class="card"><h3>Lo que este cuento siembra en ${esc(yo.grado)}</h3><ul class="seeds">${comp.map((k) => `<li><b>${esc(k.nombre)}.</b> ${esc(k.semillas[yo.grado] || '')}</li>`).join('')}</ul></div>` : ''}
  </div>`;
  box.onclick = (e) => {
    const k = e.target.dataset?.hecho; if (!k) return;
    if (k === 'emocion') { const txt = $('#sentir').value.trim(); if (txt.length < 3) { aviso('Cuéntanos un poquito 🙂'); return; } yo.respuestas['sentir-' + p.id] = txt; guardar(); }
    sumar(2, `crecer-${k}-${p.id}`); yo.hechas[`crecer-${p.id}`] = true; guardar(); pCrecer(p);
  };
}
/* Reinventar */
function pReinventar(p) {
  const A = vista.aprende; const box = $('#tabcont');
  const retos = p.reinventar?.length ? p.reinventar : ['Inventa otro final para el cuento.'];
  const mias = yo.versiones.filter((v) => v.cuentoId === p.id);
  const consigna = retos[A.consigna] || retos[0];
  box.innerHTML = `<div class="open">
    <div class="card"><h3>Elige tu reto</h3>
      <div class="prompts">${retos.map((x, k) => `<div class="opt-fila"><button class="prompt" type="button" data-k="${k}" aria-pressed="${k === A.consigna}">${esc(x)}</button>${botonVoz(x)}</div>`).join('')}</div>
      <label for="nuevo" class="hint">Escribe tu versión. No hay una sola forma correcta: es tu imaginación.</label>
      <textarea id="nuevo" style="min-height:180px;margin-top:6px" placeholder="Había una vez…"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" type="button" id="guardarV">Guardar mi cuento</button>${guardian.modo ? '<button class="btn ghost" type="button" id="comentarV">Que el Guardián lo lea</button>' : ''}</div>
      <div id="aiV"></div></div>
    <div class="card"><h3>Mis cuentos reinventados</h3>
      ${mias.length ? `<div class="versions">${mias.map((v, i) => `<div class="version"><small>${esc(v.fecha)} · ${esc(v.consigna)}</small><p>${esc(v.texto)}</p>
        <div class="row"><a class="btn small" target="_blank" rel="noopener" href="${waLink(p, v)}">Enviar a CENTEC por WhatsApp</a></div></div>`).join('')}</div>
        <p class="wa" style="margin-top:10px">Si el botón no abre WhatsApp, escribe al ${WHATSAPP_VISIBLE}. Firma solo con tu nombre y grado.</p>`
        : '<p class="hint" style="margin:0">Todavía no has guardado ninguno. ¡El primero siembra 3 semillas!</p>'}
    </div></div>`;
  box.onclick = (e) => {
    const b = e.target.closest('.prompt'); if (b) { const txt = $('#nuevo').value; A.consigna = +b.dataset.k; pReinventar(p); $('#nuevo').value = txt; return; }
    if (e.target.id === 'guardarV') {
      const texto = $('#nuevo').value.trim(); if (texto.length < 20) { aviso('Tu cuento necesita un poquito más 🙂'); return; }
      yo.versiones.push({ cuentoId: p.id, titulo: p.titulo, consigna, texto, fecha: new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) });
      guardar(); sumar(3); yo.hechas[`reinventar-${p.id}`] = true; guardar(); pReinventar(p);
    }
    if (e.target.id === 'comentarV') { const txt = $('#nuevo').value.trim(); if (txt.length < 20) { aviso('Escribe tu cuento primero'); return; } comentar(e.target, $('#aiV'), p, consigna, txt); }
  };
}
// El cuento reinventado es del niño: se comparte su texto, no el del libro.
function textoCompartir(p, v) { return `Cuento reinventado · El Jardín Mágico del Saber\nCuento: ${p.titulo}\nReto: ${v.consigna}\n\n${v.texto}\n\nFirma (solo nombre y grado): `; }
function waLink(p, v) { return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoCompartir(p, v))}`; }

/* ---------- Guardián (IA) ---------- */
async function iniciarGuardian() {
  const intentos = [];
  if (window.claude?.use) intentos.push(window.claude.use('sample').then((s) => { if (s && !guardian.modo) guardian = { modo: 'claude', sample: s }; }).catch(() => {}));
  intentos.push(fetch('./api/guardian', { method: 'GET' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j?.ok && !guardian.modo) guardian = { modo: 'web' }; }).catch(() => {}));
  await Promise.allSettled(intentos);
}
async function preguntarGuardian({ tarea, p, consigna, respuesta }, onText) {
  const grado = yo.grado;
  if (guardian.modo === 'claude') {
    const { prompt, json } = construirPrompt({ tarea, cuento: { titulo: p.titulo, texto: (p.parrafos || []).map((x) => x.replace(/\*\*/g, '')) }, grado, consigna, respuesta });
    if (json) return guardian.sample.json(prompt, { modelTier: 'quick', cache: false });
    const r = await guardian.sample(prompt, { modelTier: 'quick', cache: false, onText: ({ text }) => onText?.(text) });
    return r.text;
  }
  if (guardian.modo === 'web') {
    const r = await fetch('./api/guardian', { method: 'POST', headers: { 'content-type': 'application/json', 'x-jardin': 'lector' }, body: JSON.stringify({ tarea, cuentoId: p.id, grado, consigna, respuesta }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: j.code || 'upstream_error' };
    if (tarea === 'preguntas') return j.preguntas;
    onText?.(j.texto); return j.texto;
  }
  throw { code: 'not_granted' };
}
function mensajeError(e) {
  const c = e?.code;
  if (c === 'not_granted' || c === 'sampling_disabled') { guardian = { modo: null }; return 'El Guardián no está disponible en este momento. Puedes seguir con las preguntas del libro.'; }
  if (c === 'rate_limited') return 'El Guardián está atendiendo a muchos niños. Intenta de nuevo en un ratico.';
  if (c === 'refused') return 'El Guardián prefiere que volvamos al cuento. Intenta con otras palabras.';
  return 'No llegó la respuesta del Guardián. Toca el botón otra vez.';
}

/* ---------- Índice ---------- */
function pintarIndice(ancla) {
  const U = indice.unidades || [];
  const grupos = [];
  for (const it of secuencia) {
    if (it.tipo === 'unidad') grupos.push({ u: it.unidad, items: [] });
    else if ((it.tipo === 'cuento' || it.tipo === 'lectura') && grupos.length) grupos[grupos.length - 1].items.push(it);
  }
  const intro = secuencia.filter((x) => x.tipo === 'texto');
  const leidos = Object.keys(yo.leidos).length; const total = secuencia.filter((x) => x.tipo === 'cuento' || x.tipo === 'lectura').length;
  const mural = (medios.mural || []).filter((m) => m.aprobado !== false);
  void U;
  $('#app').innerHTML = `
    <div class="section-title"><h2>Índice del libro</h2><span class="chip">${leidos} de ${total} leídos</span></div>
    <p class="lead">Toca un cuento para abrirlo en el libro. Cada uno trae su Ruta Lectora y su hoja «Aprende con este cuento» para jugar, pensar, crecer y reinventar.</p>
    <div class="row" style="margin:14px 0"><a class="btn" href="#libro/portada/1">📖 Abrir el libro</a>${yo.pos ? `<a class="btn ghost" href="#libro/${yo.pos.id}/${(yo.pos.hoja || 0) + 1}">Seguir donde quedé</a>` : ''}</div>
    ${intro.length ? `<div class="card" style="margin-bottom:14px"><h3>Para empezar</h3><ul class="lista-indice">${intro.map((x) => `<li><a href="#libro/${x.id}/1">${esc(x.titulo)}</a></li>`).join('')}</ul></div>` : ''}
    <div class="unidades">${grupos.map((g) => { const T = tema(g.u.tema); return `<section class="card unidad-card" style="--ua:${T.a};--ub:${T.b}">
      <div class="unidad-arte" aria-hidden="true">${motivo(T.m[0], T.c[0], 86, 26, 56, -10)}${motivo(T.m[1], T.c[1], 70, 70, 40, 12)}</div>
      <div class="kicker" style="text-align:left">${esc(etiquetaUnidad(g.u))}</div><h3>${esc(g.u.titulo || etiquetaUnidad(g.u))}</h3>
      <ol class="lista-indice">${g.items.map((x) => `<li><a href="#libro/${x.id}/1">${esc(x.titulo)}</a>${yo.leidos[x.id] ? ' <span class="ok">✓</span>' : ''}</li>`).join('')}</ol></section>`; }).join('')}</div>
    <div class="chapter" style="margin-top:28px">
      <div class="card"><h3>Dado de la imaginación</h3><p class="hint">Lanza el dado y crea un cuento nuevo con lo que salga.</p><div class="dice-out" id="dadoOut" aria-live="polite">Toca el botón para lanzar.</div><button class="btn" id="dado" type="button">Lanzar el dado</button></div>
      <a class="compass-banner invest" href="#por-que-leer" style="margin:0"><span class="compass-ico" aria-hidden="true">📈</span><span><b>Leer es la mejor inversión</b>Para familias y docentes: lo que gana un niño que lee todos los días.</span></a>
    </div>
    <div class="section-title" id="mural"><h2>Mural de cuentos reinventados</h2></div>
    ${mural.length ? `<div class="mural">${mural.map((m) => `<article><small>${esc(m.cuento || '')}</small><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p><small>${esc(m.firma || '')}</small></article>`).join('')}</div>`
      : `<div class="empty">Aquí aparecerán los cuentos que niños y familias reinventen. Escribe el tuyo en «Reinventar» y envíalo a CENTEC por WhatsApp (<b>${WHATSAPP_VISIBLE}</b>).</div>`}`;
  $('#dado').onclick = () => {
    const d = marco.dadoImaginacion; const r = (a) => a[Math.floor(Math.random() * a.length)];
    const t = `Un día, ${r(d.personajes)} llegó a ${r(d.lugares)} y descubrió que ${r(d.problemas)}. ¿Qué pasó después?`;
    $('#dadoOut').innerHTML = `${esc(t)} ${botonVoz(t)}`;
  };
  if (ancla === 'mural') $('#mural').scrollIntoView(); else window.scrollTo(0, 0);
}

/* ---------- Árbol ---------- */
function pintarArbol() {
  const e = etapa(yo.semillas); const leidos = Object.keys(yo.leidos).length; const total = secuencia.filter((x) => x.tipo === 'cuento' || x.tipo === 'lectura').length;
  $('#app').innerHTML = `
    <div class="section-title"><h2>Mi Árbol del Saber</h2></div>
    <div class="card tree-panel">${arbolSVG(e.i)}<div>
      <p style="font-size:1.2rem;margin:0"><b>${yo.semillas} semillas</b> · tu árbol es un <b>${e.nombre}</b>.</p>
      <p class="hint">${e.sig ? `Te faltan ${e.sig.min - yo.semillas} semillas para llegar a ${e.sig.nombre}.` : '¡Llegaste a la cima! Ahora ayuda a alguien más a sembrar su árbol.'}</p>
      <div class="stages">${ETAPAS.map((x, k) => `<span class="${k <= e.i ? 'on' : ''}">${x.nombre}</span>`).join('')}</div></div></div>
    <div class="section-title"><h2>Cómo se ganan semillas</h2></div>
    <div class="card"><ul><li>Terminar de leer un cuento o una lectura: 1 semilla.</li><li>Acertar en «Jugar»: 2 semillas al primer intento, 1 si lo logras después de equivocarte.</li><li>Escribir tu respuesta en «Pensar»: 2 semillas.</li><li>Practicar lo de «Crecer»: 2 semillas cada cosa.</li><li>Reinventar un cuento: 3 semillas.</li></ul>
    <p class="hint" style="margin-top:10px">Llevas ${leidos} de ${total} cuentos y lecturas y ${yo.versiones.length} cuento${yo.versiones.length === 1 ? '' : 's'} reinventado${yo.versiones.length === 1 ? '' : 's'}. Tus semillas viven en este dispositivo; nadie más las ve.</p></div>`;
  window.scrollTo(0, 0);
}

/* ---------- Competencias ---------- */
function pintarCompetencias() {
  const M = marco.competencias; const g = yo.grado;
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(M.titulo)}</h2><span class="chip rev">En revisión</span></div>
    <p class="lead">El objetivo es que cada niño se enamore de leer y llegue a ser un lector experto. ${esc(M.nota)}</p>
    <p class="hint" style="margin:14px 0 4px">Mostrando las semillas de <b>${esc(g)}</b>. Cambia el grado arriba.</p>
    ${M.familias.map((f) => `<div class="section-title"><h2 style="font-size:1.3rem">${f.icono} ${esc(f.nombre)}</h2></div>
      <div class="comp-grid">${M.lista.filter((k) => k.familia === f.id).map((k) => `<article class="card comp">
        <h3>${esc(k.nombre)}</h3><p class="hint" style="margin:0 0 8px">Meta del lector experto: ${esc(k.meta)}</p>
        <p class="seed"><span>Semilla en ${esc(g)}</span>${esc(k.semillas[g])}</p>
        <p style="margin:8px 0 0;font-size:.92rem"><b>Cómo la siembra el libro:</b> ${esc(k.comoLoSiembra)}</p></article>`).join('')}</div>`).join('')}`;
  window.scrollTo(0, 0);
}

/* ---------- Por qué leer ---------- */
function pintarPorQueLeer() {
  const P = marco.porQueLeer; const F = Object.fromEntries(P.fuentes.map((f, i) => [f.id, { ...f, n: i + 1 }]));
  const refs = (ids = []) => ids.map((id) => `<a class="ref" href="#fuente-${id}" data-ref="${id}">[${F[id].n}]</a>`).join('');
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(P.titulo)}</h2></div>
    ${P.intro.map((p) => `<p class="lead">${esc(p)}</p>`).join('')}
    ${P.areas.map((a) => `<div class="section-title"><h2 style="font-size:1.3rem">${a.icono} ${esc(a.nombre)}</h2></div>
      <div class="comp-grid">${a.beneficios.map((x) => `<article class="card comp"><h3>${esc(x.titulo)}</h3>
        <p style="margin:0 0 8px">${esc(x.adulto)} ${refs(x.fuente)}</p>
        <p class="seed"><span>Cómo empieza en el Jardín</span>${esc(x.nino)}</p>
        <p class="hint" style="margin:8px 0 0;font-size:.85rem">Evidencia: ${esc(x.evidencia)}</p></article>`).join('')}</div>`).join('')}
    <div class="section-title"><h2 style="font-size:1.3rem">${esc(P.habito.titulo)}</h2></div>
    <div class="card"><ol class="plan">${P.habito.pasos.map((x) => `<li>${esc(x)} ${botonVoz(x)}</li>`).join('')}</ol></div>
    <div class="section-title"><h2 style="font-size:1.1rem">Fuentes</h2></div>
    <ol class="fuentes">${P.fuentes.map((f) => `<li id="fuente-${f.id}">${esc(f.cita)} ${f.doi ? `<a href="https://doi.org/${esc(f.doi)}" target="_blank" rel="noopener">doi:${esc(f.doi)}</a>` : `<span class="hint">(${esc(f.nota || 'DOI por verificar')})</span>`}</li>`).join('')}</ol>`;
  $('#app').onclick = (e) => { const r = e.target.closest('[data-ref]'); if (!r) return; e.preventDefault(); document.getElementById('fuente-' + r.dataset.ref)?.scrollIntoView({ behavior: 'smooth' }); };
  window.scrollTo(0, 0);
}

/* ---------- Protección: lectura en pantalla ---------- */
function proteger() {
  const libre = (t) => t?.closest?.('input,textarea,[contenteditable="true"]');
  ['copy', 'cut', 'dragstart', 'selectstart'].forEach((ev) => document.addEventListener(ev, (e) => { if (!libre(e.target)) { e.preventDefault(); if (ev === 'copy') aviso('Este libro es de lectura en pantalla 📖'); } }));
  document.addEventListener('contextmenu', (e) => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'p', 'a', 'u'].includes(k) && !libre(e.target)) { e.preventDefault(); aviso('Este libro es de lectura en pantalla 📖'); }
  });
  window.addEventListener('beforeprint', () => aviso('Este libro no se imprime: es de lectura en pantalla.'));
}

iniciar();
