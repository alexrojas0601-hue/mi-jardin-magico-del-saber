import { construirPrompt } from './guardian.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sinEmoji = (s) => String(s).replace(/[\p{Extended_Pictographic}️‍]/gu, '').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?»])/g, '$1').trim();
const WHATSAPP = '573184905115';
const WHATSAPP_VISIBLE = '318 490 5115';

/* ---------- Estado por persona (solo en este navegador) ---------- */
const CLAVE = 'jardin-magico-v1';
const inicial = { semillas: 0, hechas: {}, respuestas: {}, versiones: [], rol: 'estudiante', grado: '1.°', leidos: {} };
let yo = cargar();
function cargar() {
  try { return { ...inicial, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') }; } catch { return { ...inicial }; }
}
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
  const p = [];
  p.push('<ellipse class="t-ground" cx="60" cy="108" rx="46" ry="9"/>');
  if (i === 0) p.push('<ellipse class="t-seed" cx="60" cy="102" rx="7" ry="5"/>');
  if (i === 1) p.push('<rect class="t-trunk" x="58.5" y="88" width="3" height="16" rx="1.5"/><ellipse class="t-leaf" cx="52" cy="88" rx="8" ry="4" transform="rotate(-25 52 88)"/><ellipse class="t-leaf" cx="68" cy="86" rx="8" ry="4" transform="rotate(25 68 86)"/>');
  if (i === 2) p.push('<rect class="t-trunk" x="57.5" y="70" width="5" height="36" rx="2"/><ellipse class="t-leaf" cx="48" cy="76" rx="11" ry="5" transform="rotate(-25 48 76)"/><ellipse class="t-leaf" cx="72" cy="72" rx="11" ry="5" transform="rotate(25 72 72)"/><circle class="t-leaf" cx="60" cy="64" r="9"/>');
  if (i >= 3) {
    const r = i >= 4 ? 34 : 26;
    p.push(`<path class="t-trunk" d="M55 106 L56 66 Q60 60 64 66 L65 106 Z"/>`);
    p.push(`<circle class="t-leaf" cx="60" cy="${i >= 4 ? 46 : 52}" r="${r}"/><circle class="t-leaf" cx="${60 - r * .7}" cy="${i >= 4 ? 58 : 62}" r="${r * .6}"/><circle class="t-leaf" cx="${60 + r * .7}" cy="${i >= 4 ? 58 : 62}" r="${r * .6}"/>`);
  }
  if (i >= 4) [[44, 40], [72, 34], [58, 58], [80, 56], [38, 60]].forEach(([x, y]) => p.push(`<circle class="t-flower" cx="${x}" cy="${y}" r="3.6"/>`));
  if (i >= 5) [[22, 18], [98, 22], [60, 6]].forEach(([x, y]) => p.push(`<path class="t-star" d="M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y - 1.6} L${x + 2.6} ${y + 1.2} L${x + 3.8} ${y + 5.6} L${x} ${y + 3} L${x - 3.8} ${y + 5.6} L${x - 2.6} ${y + 1.2} L${x - 6} ${y - 1.6} L${x - 1.8} ${y - 1.8} Z"/>`));
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${p.join('')}</svg>`;
}
function pintarChip() {
  const e = etapa(yo.semillas);
  $('#treeChip').innerHTML = `${arbolSVG(e.i)}<span><b>${yo.semillas}</b><small>semillas · ${e.nombre}</small></span>`;
}

/* ---------- Avisos ---------- */
let t;
function aviso(txt) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = txt; el.hidden = false;
  clearTimeout(t); t = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Guardián (Claude) ---------- */
// En claude.ai usa la capacidad "sample"; en sabicentec.com usa el Worker /api/guardian.
let guardian = { modo: null };
async function iniciarGuardian() {
  const intentos = [];
  if (window.claude?.use) {
    intentos.push(window.claude.use('sample').then((s) => { if (s && !guardian.modo) guardian = { modo: 'claude', sample: s }; }).catch(() => {}));
  }
  intentos.push(fetch('./api/guardian', { method: 'GET' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j?.ok && !guardian.modo) guardian = { modo: 'web' }; }).catch(() => {}));
  await Promise.allSettled(intentos);
  if (vista.cuento) pintarCuento();
}
async function preguntarGuardian({ tarea, cuento, consigna, respuesta }, onText) {
  const grado = yo.grado;
  if (guardian.modo === 'claude') {
    const { prompt, json } = construirPrompt({ tarea, cuento, grado, consigna, respuesta });
    if (json) return guardian.sample.json(prompt, { modelTier: 'quick', cache: false });
    const r = await guardian.sample(prompt, { modelTier: 'quick', cache: false, onText: ({ text }) => onText?.(text) });
    return r.text;
  }
  if (guardian.modo === 'web') {
    const r = await fetch('./api/guardian', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tarea, cuentoId: cuento.id, grado, consigna, respuesta }),
    });
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

/* ---------- Datos ---------- */
let libro, medios;
const vista = { cuento: null, tab: 'leer', q: 0, intento: 0, consigna: 0 };

async function iniciar() {
  try {
    [libro, medios] = await Promise.all([
      fetch('./data/cuentos.json').then((r) => r.json()),
      fetch('./data/medios.json').then((r) => r.json()).catch(() => ({ videos: {}, mural: [] })),
    ]);
  } catch {
    $('#app').innerHTML = '<div class="empty">No pudimos abrir el libro. Revisa tu conexión y recarga la página.</div>';
    return;
  }
  pintarControles(); pintarChip();
  window.addEventListener('hashchange', rutear);
  rutear();
  iniciarGuardian();
}

function pintarControles() {
  const roles = [['estudiante', 'Estudiante'], ['familia', 'Familia'], ['docente', 'Docente']];
  $('#roles').innerHTML = roles.map(([v, n]) => `<button type="button" data-rol="${v}" aria-pressed="${yo.rol === v}">${n}</button>`).join('');
  $('#roles').onclick = (e) => { const b = e.target.closest('[data-rol]'); if (!b) return; yo.rol = b.dataset.rol; guardar(); pintarControles(); rutear(); };
  const sel = $('#grado');
  sel.innerHTML = libro.grados.map((g) => `<option ${g === yo.grado ? 'selected' : ''}>${g}</option>`).join('');
  sel.onchange = () => { yo.grado = sel.value; guardar(); rutear(); };
  $('#treeChip').onclick = () => { location.hash = 'arbol'; rutear(); };
}

function rutear() {
  const h = decodeURIComponent(location.hash.slice(1));
  const c = libro.cuentos.find((x) => x.id === h);
  if (c) { if (vista.cuento?.id !== c.id) Object.assign(vista, { cuento: c, tab: 'leer', q: 0, intento: 0, consigna: 0 }); pintarCuento(); }
  else if (h === 'arbol') { vista.cuento = null; pintarArbol(); }
  else if (h === 'competencias') { vista.cuento = null; pintarCompetencias(); }
  else if (h === 'mural') { vista.cuento = null; pintarInicio('mural'); }
  else { vista.cuento = null; pintarInicio(); }
}

/* ---------- Inicio ---------- */
function progresoCuento(c) {
  const ops = c.preguntas.filter((q) => q.tipo === 'opcion');
  return { leido: !!yo.leidos[c.id], buenas: ops.filter((q) => yo.hechas[q.id]).length, total: ops.length };
}
function pintarInicio(ancla) {
  const cap = libro.capitulos[0];
  const mural = (medios.mural || []).filter((m) => m.aprobado !== false);
  $('#app').innerHTML = `
    <section class="chapter">
      <div class="intro">
        <span class="chip">Capítulo especial</span>
        <h2 style="font-size:clamp(1.7rem,4.4vw,2.4rem);margin:10px 0 12px">${esc(cap.titulo)}</h2>
        ${cap.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      <aside class="dice" aria-labelledby="dado-t">
        <h3 id="dado-t">Dado de la imaginación</h3>
        <p class="hint" style="margin:0">Lanza el dado y crea un cuento nuevo con lo que salga.</p>
        <div class="dice-out" id="dadoOut" aria-live="polite">Toca el botón para lanzar.</div>
        <button class="btn" id="dado" type="button">Lanzar el dado</button>
      </aside>
    </section>
    <a class="compass-banner" href="#competencias">
      <span class="compass-ico" aria-hidden="true">🧭</span>
      <span><b>Leer para crecer</b>Pensamiento crítico, palabras precisas, imaginación, emociones, valores y disciplina: mira qué siembra cada cuento en ${esc(yo.grado)}.</span>
      <span class="btn small">Ver competencias</span>
    </a>
    <div class="section-title"><h2>Los cuentos</h2><span class="chip">${libro.cuentos.length} cuentos · Transición a 3.°</span></div>
    <div class="shelf">
      ${libro.cuentos.map((c, i) => {
        const p = progresoCuento(c);
        return `<button class="book" type="button" data-id="${c.id}">
          <span class="num">${i + 1}</span>
          <h3>${esc(c.titulo)}</h3>
          <p>${esc(sinEmoji(c.texto[0]).slice(0, 110))}…</p>
          <span class="meta"><span>${p.leido ? 'Leído' : 'Sin leer'}</span><span class="dot">${Array.from({ length: p.total }, (_, k) => `<i class="${k < p.buenas ? 'on' : ''}"></i>`).join('')}</span>${medios.videos?.[c.id] ? '<span>Videoclip</span>' : ''}</span>
        </button>`;
      }).join('')}
    </div>
    <div class="section-title" id="mural"><h2>Mural de cuentos reinventados</h2><span class="chip">Cuentos de la comunidad CENTEC</span></div>
    ${mural.length ? `<div class="mural">${mural.map((m) => `<article><small>${esc(m.cuento || '')}</small><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p><small>${esc(m.firma || '')}</small></article>`).join('')}</div>`
      : `<div class="empty">Aquí aparecerán los cuentos que niños y familias reinventen. Escribe el tuyo en la pestaña <b>Reinventar</b> de cualquier cuento y envíalo a CENTEC por WhatsApp (<b>${WHATSAPP_VISIBLE}</b>). Los publicamos después de leerlos.</div>`}
  `;
  $('.shelf').onclick = (e) => { const b = e.target.closest('[data-id]'); if (b) location.hash = b.dataset.id; };
  $('#dado').onclick = () => {
    const d = libro.dadoImaginacion; const r = (a) => a[Math.floor(Math.random() * a.length)];
    $('#dadoOut').innerHTML = `Un día, <b>${esc(r(d.personajes))}</b> llegó a <b>${esc(r(d.lugares))}</b> y descubrió que <b>${esc(r(d.problemas))}</b>. ¿Qué pasó después?`;
  };
  if (ancla === 'mural') $('#mural').scrollIntoView();
  else window.scrollTo(0, 0);
}

/* ---------- Árbol ---------- */
function pintarArbol() {
  const e = etapa(yo.semillas);
  const leidos = Object.keys(yo.leidos).length;
  $('#app').innerHTML = `
    <button class="back" type="button" id="volver">← Volver a los cuentos</button>
    <div class="section-title"><h2>Mi Árbol del Saber</h2></div>
    <div class="card tree-panel">
      ${arbolSVG(e.i)}
      <div>
        <p style="font-size:1.2rem;margin:0"><b>${yo.semillas} semillas</b> · tu árbol es un <b>${e.nombre}</b>.</p>
        <p class="hint">${e.sig ? `Te faltan ${e.sig.min - yo.semillas} semillas para llegar a ${e.sig.nombre}.` : '¡Llegaste a la cima! Ahora ayuda a alguien más a sembrar su árbol.'}</p>
        <div class="stages">${ETAPAS.map((x, k) => `<span class="${k <= e.i ? 'on' : ''}">${x.nombre}</span>`).join('')}</div>
      </div>
    </div>
    <div class="section-title"><h2>Cómo se ganan semillas</h2></div>
    <div class="card"><ul>
      <li>Terminar de leer un cuento: 1 semilla.</li>
      <li>Acertar en «Jugar»: 2 semillas al primer intento, 1 si lo logras después de equivocarte.</li>
      <li>Escribir tu respuesta en «Pensar»: 2 semillas.</li>
      <li>Reinventar un cuento: 3 semillas.</li>
    </ul>
    <p class="hint" style="margin-top:10px">Llevas ${leidos} de ${libro.cuentos.length} cuentos leídos y ${yo.versiones.length} cuento${yo.versiones.length === 1 ? '' : 's'} reinventado${yo.versiones.length === 1 ? '' : 's'}. Tus semillas viven en este dispositivo; nadie más las ve.</p></div>`;
  $('#volver').onclick = () => { location.hash = ''; };
  window.scrollTo(0, 0);
}

/* ---------- Cuento ---------- */
const TABS = [['leer', 'Leer'], ['jugar', 'Jugar'], ['pensar', 'Pensar'], ['crecer', 'Crecer'], ['reinventar', 'Reinventar'], ['video', 'Videoclip']];
function pintarCuento() {
  const c = vista.cuento; const i = libro.cuentos.indexOf(c);
  $('#app').innerHTML = `
    <button class="back" type="button" id="volver">← Todos los cuentos</button>
    <div class="story-head">
      <h2><span class="num">${i + 1}.</span> ${esc(c.titulo)}</h2>
      <div class="row">${i > 0 ? `<a class="btn ghost small" href="#${libro.cuentos[i - 1].id}">Anterior</a>` : ''}${i < libro.cuentos.length - 1 ? `<a class="btn ghost small" href="#${libro.cuentos[i + 1].id}">Siguiente</a>` : ''}</div>
    </div>
    <div class="tabs" role="tablist">${TABS.map(([v, n]) => `<button role="tab" type="button" data-tab="${v}" aria-selected="${vista.tab === v}">${n}</button>`).join('')}</div>
    <div class="layout"><div id="panel" role="tabpanel" style="min-width:0"></div><aside class="side" id="guia"></aside></div>`;
  $('#volver').onclick = () => { location.hash = ''; };
  $('.tabs').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; vista.tab = b.dataset.tab; pararVoz(); pintarCuento(); };
  ({ leer: pLeer, jugar: pJugar, pensar: pPensar, crecer: pCrecer, reinventar: pReinventar, video: pVideo })[vista.tab](c);
  pGuia(c);
}

function pGuia(c) {
  const g = $('#guia'); const rev = libro.revision?.estado === 'en revisión';
  if (yo.rol === 'docente') {
    const d = c.guiaDocente;
    g.innerHTML = `<div class="card"><h3>Guía docente</h3>${rev ? '<span class="chip rev">En revisión pedagógica</span>' : ''}
      <p style="margin-top:10px"><b>Propósito:</b> ${esc(d.proposito)}</p>
      <p><b>Competencias:</b></p><ul>${d.competencias.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      ${chipsCompetencias(c)}
      <p style="margin-top:8px"><b>Actividad de aula:</b> ${esc(d.actividad)}</p>
      <p><b>Error frecuente:</b> ${esc(d.errorFrecuente)}</p>
      <p class="hint">DBA: por verificar con el docente de Lenguaje del grado.</p></div>${ruta(c)}`;
  } else if (yo.rol === 'familia') {
    g.innerHTML = `<div class="card"><h3>Para acompañar en casa</h3><p>${esc(c.guiaFamilia)}</p><p><b>Reto en familia:</b> ${esc(c.rutaLectora.reto)}</p><p class="hint">Sesiones cortas (10 a 15 minutos), siempre juntos.</p></div>${ruta(c)}`;
  } else {
    const tip = yo.grado === 'Transición' ? 'Pide a un adulto que te lea el cuento. Puedes responder hablando o dibujando.' : 'Lee despacio. Si una palabra es nueva, búscala en «Palabras mágicas».';
    g.innerHTML = `<div class="card"><h3>Para ti</h3><p>${tip}</p><p class="hint">Cada respuesta siembra semillas en tu Árbol del Saber.</p></div>${ruta(c)}`;
  }
}
function ruta(c) {
  const r = c.rutaLectora;
  const lista = (a) => `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<div class="card ruta"><h3>Ruta Lectora CENTEC</h3><h4>Literal</h4>${lista(r.literal)}<h4>Inferencial</h4>${lista(r.inferencial)}<h4>Crítico</h4>${lista(r.critico)}</div>`;
}

/* Leer */
let tamano = 1.15;
function pLeer(c) {
  $('#panel').innerHTML = `
    <div class="toolbar">
      <button class="btn navy small" type="button" id="oir">Escuchar el cuento</button>
      <button class="btn ghost small" type="button" id="menos" aria-label="Letra más pequeña">A−</button>
      <button class="btn ghost small" type="button" id="mas" aria-label="Letra más grande">A+</button>
    </div>
    <article class="reading" style="--read:${tamano}rem">${c.texto.map((p) => `<p>${esc(p)}</p>`).join('')}</article>
    <div class="card" style="max-width:65ch;margin-top:8px"><h3>Palabras mágicas</h3><div class="words">${c.vocabulario.map((v) => `<span class="word"><b>${esc(v.palabra)}</b>: ${esc(v.significado)}</span>`).join('')}</div></div>
    <div class="row" style="margin-top:18px"><button class="btn" type="button" id="leido">${yo.leidos[c.id] ? 'Ya lo leíste · ir a Jugar' : 'Terminé de leer'}</button></div>`;
  $('#mas').onclick = () => { tamano = Math.min(1.6, tamano + 0.1); $('.reading').style.setProperty('--read', tamano + 'rem'); };
  $('#menos').onclick = () => { tamano = Math.max(1, tamano - 0.1); $('.reading').style.setProperty('--read', tamano + 'rem'); };
  const oir = $('#oir');
  if (!('speechSynthesis' in window)) oir.hidden = true;
  oir.onclick = () => {
    if (speechSynthesis.speaking) { pararVoz(); oir.textContent = 'Escuchar el cuento'; return; }
    try {
      const u = new SpeechSynthesisUtterance(sinEmoji(c.titulo + '. ' + c.texto.join(' ')));
      u.lang = 'es-CO'; u.rate = 0.9;
      const voz = speechSynthesis.getVoices().find((v) => v.lang?.startsWith('es'));
      if (voz) u.voice = voz;
      u.onend = () => { oir.textContent = 'Escuchar el cuento'; };
      speechSynthesis.speak(u); oir.textContent = 'Detener';
    } catch { oir.hidden = true; }
  };
  $('#leido').onclick = () => {
    if (!yo.leidos[c.id]) { yo.leidos[c.id] = true; guardar(); sumar(1); }
    vista.tab = 'jugar'; pintarCuento(); window.scrollTo(0, 0);
  };
}
function pararVoz() { try { speechSynthesis.cancel(); } catch { /* nada */ } }

/* Jugar */
function orden(q) {
  // Orden de opciones estable por pregunta (la correcta no siempre va primero).
  let h = 0; for (const ch of q.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return q.opciones.map((_, k) => k).sort((a, b) => ((a * 7 + h) % 5) - ((b * 7 + h) % 5) || a - b);
}
function pJugar(c) {
  const qs = c.preguntas.filter((q) => q.tipo === 'opcion');
  if (vista.q >= qs.length) {
    const p = progresoCuento(c);
    $('#panel').innerHTML = `<div class="card done-box quiz"><b>${p.buenas} de ${p.total}</b><p>Terminaste el juego de «${esc(c.titulo)}». Ahora pasa a <b>Pensar</b>: allí no hay respuestas únicas, hay buenas razones.</p>
      <div class="row" style="justify-content:center"><button class="btn" type="button" id="aPensar">Ir a Pensar</button><button class="btn ghost" type="button" id="otraVez">Jugar otra vez</button></div></div>`;
    $('#aPensar').onclick = () => { vista.tab = 'pensar'; pintarCuento(); };
    $('#otraVez').onclick = () => { vista.q = 0; vista.intento = 0; pintarCuento(); };
    return;
  }
  const q = qs[vista.q];
  $('#panel').innerHTML = `<div class="quiz">
    <div class="qprog" aria-hidden="true">${qs.map((_, k) => `<i class="${k < vista.q ? 'done' : k === vista.q ? 'now' : ''}"></i>`).join('')}</div>
    <div class="qlevel">Pregunta ${vista.q + 1} de ${qs.length} · ${esc(q.nivel)}</div>
    <p class="qtext">${esc(q.pregunta)}</p>
    <div class="opts">${orden(q).map((k) => `<button class="opt" type="button" data-k="${k}">${esc(q.opciones[k])}</button>`).join('')}</div>
    <div id="fb" aria-live="polite"></div></div>`;
  $('.opts').onclick = (e) => {
    const b = e.target.closest('[data-k]'); if (!b || b.disabled) return;
    const k = +b.dataset.k;
    if (k === q.correcta) {
      b.classList.add('right');
      document.querySelectorAll('.opt').forEach((x) => { x.disabled = true; });
      sumar(vista.intento === 0 ? 2 : 1, q.id);
      $('#fb').innerHTML = `<div class="fb ok"><b>¡Muy bien!</b> ${q.dondeLoDice ? `Así lo dice el cuento: <q>${esc(sinEmoji(q.dondeLoDice))}</q>` : esc(q.porque || '')}
        <div class="row" style="margin-top:10px"><button class="btn small" type="button" id="sig">Siguiente</button></div></div>`;
      $('#sig').onclick = () => { vista.q++; vista.intento = 0; pintarCuento(); };
      $('#sig').focus();
    } else {
      vista.intento++;
      b.classList.add('wrong'); b.disabled = true;
      $('#fb').innerHTML = `<div class="fb err"><b>Casi.</b> El error no nos detiene: nos enseña. ${q.dondeLoDice ? 'Vuelve a la pestaña Leer y busca la oración que lo dice.' : 'Piensa en lo que sintieron los personajes y elige otra.'}</div>`;
    }
  };
}

/* Pensar */
function pPensar(c) {
  const qs = c.preguntas.filter((q) => q.tipo === 'abierta');
  $('#panel').innerHTML = `<div class="open">
    ${qs.map((q) => `<div class="card" data-q="${q.id}">
      <div class="qlevel">${esc(q.nivel)}</div>
      <p class="q">${esc(q.pregunta)}</p>
      <p class="hint">Pista: ${esc(q.pista)}</p>
      <label class="sr" for="r-${q.id}" style="position:absolute;left:-9999px">Tu respuesta</label>
      <textarea id="r-${q.id}" placeholder="${yo.grado === 'Transición' ? 'Un adulto puede escribir lo que dices.' : 'Escribe aquí con tus palabras…'}">${esc(yo.respuestas[q.id] || '')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn small" type="button" data-guardar>Guardar mi respuesta</button>${guardian.modo ? '<button class="btn ghost small" type="button" data-guardian>Que el Guardián me comente</button>' : ''}</div>
      <div data-ai></div></div>`).join('')}
    <div class="card"><h3>Nuevas preguntas del Guardián</h3>
      ${guardian.modo ? `<p class="hint">El Guardián inventa preguntas distintas cada vez, a la medida de ${esc(yo.grado)}.</p><button class="btn navy small" type="button" id="nuevas">Pedir 4 preguntas nuevas</button><div id="nuevasOut"></div>`
        : `<p class="hint" style="margin:0">Cuando el Guardián esté conectado, aquí aparecerán preguntas nuevas cada vez. Mientras tanto, usa la Ruta Lectora y el Dado de la imaginación.</p>`}
    </div></div>`;
  $('#panel').onclick = async (e) => {
    const card = e.target.closest('[data-q]');
    if (e.target.matches('[data-guardar]') && card) {
      const id = card.dataset.q; const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso('Escribe un poquito más 🙂'); return; }
      yo.respuestas[id] = txt; guardar();
      if (!sumar(2, 'resp-' + id)) aviso('Respuesta guardada');
    }
    if (e.target.matches('[data-guardian]') && card) {
      const q = qs.find((x) => x.id === card.dataset.q); const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso('Primero escribe tu respuesta'); return; }
      await comentar(e.target, $('[data-ai]', card), c, q.pregunta, txt);
    }
    if (e.target.id === 'nuevas') {
      const b = e.target; const out = $('#nuevasOut'); b.disabled = true; out.innerHTML = '<p class="hint" style="margin-top:10px">El Guardián está pensando…</p>';
      try {
        const lista = await preguntarGuardian({ tarea: 'preguntas', cuento: c });
        const arr = Array.isArray(lista) ? lista.filter((x) => x && x.pregunta).slice(0, 6) : [];
        out.innerHTML = arr.length ? `<ol style="margin-top:12px">${arr.map((x) => `<li style="margin-bottom:10px"><span class="qlevel">${esc(x.nivel || '')}</span><br><b>${esc(x.pregunta)}</b>${x.pista ? `<br><span class="hint">Pista: ${esc(x.pista)}</span>` : ''}</li>`).join('')}</ol>` : '<p class="hint">No llegaron preguntas. Toca otra vez.</p>';
      } catch (err) { out.innerHTML = `<p class="hint" style="margin-top:10px">${esc(mensajeError(err))}</p>`; }
      b.disabled = false;
    }
  };
}
async function comentar(btn, box, c, consigna, respuesta) {
  btn.disabled = true;
  box.innerHTML = '<div class="ai"><span class="ai-label">El Guardián</span><span data-t>Está leyendo lo que escribiste…</span></div>';
  const tEl = $('[data-t]', box);
  try {
    const txt = await preguntarGuardian({ tarea: 'comentario', cuento: c, consigna, respuesta }, (parcial) => { tEl.textContent = parcial; });
    tEl.textContent = txt;
  } catch (err) { tEl.textContent = mensajeError(err); }
  btn.disabled = false;
}

/* Crecer: emoción, valor, disciplina, innovación y conexión entre áreas */
const compPorId = (id) => libro.competencias?.lista.find((x) => x.id === id);
function chipsCompetencias(c) {
  const ids = c.brujula?.competencias || [];
  if (!ids.length) return '';
  return `<p style="margin-top:10px"><b>Siembra en ${esc(yo.grado)}:</b></p><ul class="seeds">${ids.map(compPorId).filter(Boolean)
    .map((k) => `<li><b>${esc(k.nombre)}.</b> ${esc(k.semillas[yo.grado] || '')}</li>`).join('')}</ul>`;
}
function pCrecer(c) {
  const b = c.brujula; if (!b) { $('#panel').innerHTML = '<div class="empty">Pronto.</div>'; return; }
  const hecho = (k) => !!yo.hechas[`crecer-${k}-${c.id}`];
  const accion = (k, txt) => `<button class="btn small ${hecho(k) ? 'ghost' : ''}" type="button" data-hecho="${k}" ${hecho(k) ? 'disabled' : ''}>${hecho(k) ? 'Practicado ✓' : txt}</button>`;
  $('#panel').innerHTML = `<div class="grow">
    <div class="card g-emo"><div class="qlevel">Mi corazón · Inteligencia emocional</div><h3>${esc(b.emocion.nombre)}</h3><p>${esc(b.emocion.estrategia)}</p>
      <label class="hint" for="sentir">¿Cuándo has sentido algo así?</label>
      <textarea id="sentir" style="min-height:80px;margin-top:6px" placeholder="${yo.grado === 'Transición' ? 'Cuéntalo o dibújalo; un adulto puede escribir.' : 'Escribe con tus palabras…'}">${esc(yo.respuestas['sentir-' + c.id] || '')}</textarea>
      <div class="row" style="margin-top:10px">${accion('emocion', 'Guardar y nombrar mi emoción')}</div></div>
    <div class="card g-val"><div class="qlevel">Valor con propósito</div><h3>${esc(b.valor.nombre)}</h3><p>${esc(b.valor.proposito)}</p>
      <div class="row">${accion('valor', 'Lo practiqué esta semana')}</div></div>
    <div class="card g-dis"><div class="qlevel">Disciplina</div><p>${esc(b.disciplina)}</p>
      <div class="row">${accion('disciplina', 'Cumplí mi hábito')}</div></div>
    <div class="card g-inn"><div class="qlevel">Imaginar, crear, innovar</div><p>${esc(b.innovar)}</p>
      <p class="hint" style="margin:0">Dibújalo o constrúyelo y cuéntaselo a tu familia o a tu profe.</p></div>
    <div class="card g-con"><div class="qlevel">Conecta con · ${esc(b.conecta.area)}</div><p style="margin:0">${esc(b.conecta.actividad)}</p></div>
    <div class="card"><h3>Lo que este cuento siembra en ti</h3>${chipsCompetencias(c)}<a class="btn ghost small" href="#competencias" style="margin-top:8px">Ver todas las competencias</a></div>
  </div>`;
  $('#panel').onclick = (e) => {
    const k = e.target.dataset?.hecho; if (!k) return;
    if (k === 'emocion') {
      const txt = $('#sentir').value.trim();
      if (txt.length < 3) { aviso('Cuéntanos un poquito 🙂'); return; }
      yo.respuestas['sentir-' + c.id] = txt; guardar();
    }
    sumar(2, `crecer-${k}-${c.id}`); pCrecer(c);
  };
}

/* Mapa de competencias */
function pintarCompetencias() {
  const M = libro.competencias; const g = yo.grado;
  const enCuentos = (id) => libro.cuentos.filter((c) => c.brujula?.competencias.includes(id));
  $('#app').innerHTML = `
    <button class="back" type="button" id="volver">← Volver a los cuentos</button>
    <div class="section-title"><h2>${esc(M.titulo)}</h2><span class="chip rev">En revisión</span></div>
    <p class="lead">El objetivo es que cada niño se enamore de leer y llegue a ser un lector experto. ${esc(M.nota)}</p>
    <div class="row" style="margin:16px 0 4px"><span class="hint" style="margin:0">Mostrando las semillas de <b>${esc(g)}</b>. Cambia el grado arriba.</span></div>
    ${M.familias.map((f) => `<div class="section-title"><h2 style="font-size:1.3rem">${f.icono} ${esc(f.nombre)}</h2></div>
      <div class="comp-grid">${M.lista.filter((k) => k.familia === f.id).map((k) => `<article class="card comp">
        <h3>${esc(k.nombre)}</h3>
        <p class="hint" style="margin:0 0 8px">Meta del lector experto: ${esc(k.meta)}</p>
        <p class="seed"><span>Semilla en ${esc(g)}</span>${esc(k.semillas[g])}</p>
        <p style="margin:8px 0 6px;font-size:.92rem"><b>Cómo la siembra el libro:</b> ${esc(k.comoLoSiembra)}</p>
        <div class="row">${enCuentos(k.id).map((c) => `<a class="chip link" href="#${c.id}">${libro.cuentos.indexOf(c) + 1}. ${esc(c.titulo)}</a>`).join('')}</div>
      </article>`).join('')}</div>`).join('')}`;
  $('#volver').onclick = () => { location.hash = ''; };
  window.scrollTo(0, 0);
}

/* Reinventar */
function pReinventar(c) {
  const mias = yo.versiones.filter((v) => v.cuentoId === c.id);
  const consigna = c.reinventar[vista.consigna] || c.reinventar[0];
  $('#panel').innerHTML = `<div class="open">
    <div class="card"><h3>Elige tu reto</h3>
      <div class="prompts">${c.reinventar.map((p, k) => `<button class="prompt" type="button" data-k="${k}" aria-pressed="${k === vista.consigna}">${esc(p)}</button>`).join('')}</div>
      <label for="nuevo" class="hint">Escribe tu versión del cuento. No hay una sola forma correcta: es tu imaginación.</label>
      <textarea id="nuevo" style="min-height:200px;margin-top:6px" placeholder="Había una vez…"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" type="button" id="guardarV">Guardar mi cuento</button>${guardian.modo ? '<button class="btn ghost" type="button" id="comentarV">Que el Guardián lo lea</button>' : ''}</div>
      <div id="aiV"></div>
    </div>
    <div class="card"><h3>Mis cuentos reinventados</h3>
      ${mias.length ? `<div class="versions">${mias.map((v) => `<div class="version"><small>${esc(v.fecha)} · ${esc(v.consigna)}</small><p>${esc(v.texto)}</p>
        <div class="row"><a class="btn small" target="_blank" rel="noopener" href="${waLink(c, v)}">Enviar a CENTEC por WhatsApp</a><button class="btn ghost small" type="button" data-copiar="${esc(v.fecha)}">Copiar texto</button></div></div>`).join('')}</div>
        <p class="wa" style="margin-top:10px">Si el botón no abre WhatsApp, escribe al <code>${WHATSAPP_VISIBLE}</code>. Firma solo con tu nombre y grado: CENTEC elige cuentos para el mural.</p>`
        : '<p class="hint" style="margin:0">Todavía no has guardado ninguno. ¡El primero siembra 3 semillas!</p>'}
    </div></div>`;
  $('.prompts').onclick = (e) => { const b = e.target.closest('[data-k]'); if (!b) return; const txt = $('#nuevo').value; vista.consigna = +b.dataset.k; pReinventar(c); $('#nuevo').value = txt; };
  $('#guardarV').onclick = () => {
    const texto = $('#nuevo').value.trim();
    if (texto.length < 20) { aviso('Tu cuento necesita un poquito más 🙂'); return; }
    yo.versiones.push({ cuentoId: c.id, consigna, texto, fecha: new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) });
    guardar(); sumar(3); pReinventar(c);
  };
  const cv = $('#comentarV');
  if (cv) cv.onclick = () => { const txt = $('#nuevo').value.trim(); if (txt.length < 20) { aviso('Escribe tu cuento primero'); return; } comentar(cv, $('#aiV'), c, consigna, txt); };
  $('#panel').onclick = async (e) => {
    const f = e.target.dataset?.copiar; if (!f) return;
    const v = mias.find((x) => x.fecha === f);
    try { await navigator.clipboard.writeText(textoCompartir(c, v)); aviso('Texto copiado'); }
    catch { aviso('Selecciona el texto y cópialo a mano'); }
  };
}
function textoCompartir(c, v) {
  return `Cuento reinventado · El Jardín Mágico del Saber\nCuento: ${c.titulo}\nReto: ${v.consigna}\n\n${v.texto}\n\nFirma (solo nombre y grado): `;
}
function waLink(c, v) { return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoCompartir(c, v))}`; }

/* Videoclip */
function pVideo(c) {
  const url = medios.videos?.[c.id];
  if (!url) {
    $('#panel').innerHTML = `<div class="empty video-box"><h3 style="margin-bottom:6px">El videoclip viene en camino</h3><p style="margin:0">Cuando CENTEC termine la historieta animada de «${esc(c.titulo)}», aparecerá aquí.</p></div>`;
    return;
  }
  const directo = /\.(mp4|webm|m4v)(\?|$)/i.test(url);
  $('#panel').innerHTML = `<div class="video-box">${directo ? `<video controls preload="metadata" src="${esc(url)}"></video>` : `<div class="card"><h3>Videoclip de «${esc(c.titulo)}»</h3><p>Se abre en una pestaña nueva.</p><a class="btn" href="${esc(url)}" target="_blank" rel="noopener">Ver el videoclip</a></div>`}
    <p class="hint" style="margin-top:12px">Después de verlo, vuelve a <b>Pensar</b>: ¿qué cambió entre el libro y el video?</p></div>`;
}

iniciar();
