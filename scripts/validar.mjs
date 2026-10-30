// Valida el libro antes de publicar: node scripts/validar.mjs
// 1) public/data/marco.json (competencias, «Por qué leer», dado): está en el repositorio.
// 2) contenido/libro.json (texto del libro + material de aprendizaje): NO está en git; se valida si existe.
import { readFileSync, existsSync } from 'node:fs';

const errores = [];
const leer = (r) => JSON.parse(readFileSync(new URL(r, import.meta.url), 'utf8'));
const marco = leer('../public/data/marco.json');
const medios = leer('../public/data/medios.json');

for (const g of Object.keys(marco.planGrados?.grados || {})) if (!marco.grados.includes(g)) errores.push(`Plan por grado: grado desconocido «${g}».`);
if (!marco.revision?.estado) errores.push('Falta revision.estado (todo contenido nuevo nace «en revisión»).');
const compIds = new Set((marco.competencias?.lista || []).map((k) => k.id));
for (const k of marco.competencias?.lista || []) for (const g of marco.grados) if (!k.semillas?.[g]) errores.push(`Competencia ${k.nombre}: falta la semilla de ${g}.`);
const fuentes = new Set((marco.porQueLeer?.fuentes || []).map((f) => f.id));
for (const a of marco.porQueLeer?.areas || []) for (const x of a.beneficios) for (const id of x.fuente || []) if (!fuentes.has(id)) errores.push(`Por qué leer «${x.titulo}»: fuente desconocida ${id}.`);
for (const f of marco.porQueLeer?.fuentes || []) if (!f.doi && !f.nota) errores.push(`Fuente ${f.id}: sin DOI ni nota «por verificar».`);
if (/gimnasia cerebral|brain gym/i.test(JSON.stringify(marco))) errores.push('El marco menciona «gimnasia cerebral» (neuromito).');
for (const m of medios.mural || []) if (/\d{7,}|@/.test(`${m.firma} ${m.texto}`)) errores.push(`Mural «${m.titulo}»: parece tener teléfono o correo (Ley 1581).`);
if (!existsSync(new URL('../src/libro.cifrado.txt', import.meta.url))) errores.push('Falta src/libro.cifrado.txt (libro cifrado).');
if (existsSync(new URL('../public/data/cuentos.json', import.meta.url))) errores.push('public/data/cuentos.json no debe existir: el texto del libro va cifrado, no en public/.');

let resumen = 'marco válido';
const ruta = new URL('../contenido/libro.json', import.meta.url);
if (existsSync(ruta)) {
  const libro = JSON.parse(readFileSync(ruta, 'utf8'));
  const plano = (s) => String(s).replace(/\*\*/g, '').replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').replace(/\s+([.,;:!?»)])/g, '$1').trim();
  const ids = new Set(); let n = 0;
  if (/gimnasia cerebral|brain gym/i.test(JSON.stringify(libro.paginas.map(({ parrafos, ...r }) => r)))) errores.push('El material de aprendizaje menciona «gimnasia cerebral» (neuromito).');
  for (const p of libro.paginas) {
    const donde = `«${p.titulo}» (${p.id})`;
    if (ids.has(p.id)) errores.push(`${donde}: id repetido.`); ids.add(p.id);
    if (!/^[a-z0-9-]{1,80}$/.test(p.id)) errores.push(`${donde}: id con caracteres no válidos.`);
    if (!p.parrafos?.length) errores.push(`${donde}: sin texto.`);
    if (p.tipo !== 'cuento' && p.tipo !== 'lectura') continue;
    n++;
    for (const k of ['palabras', 'literal', 'inferencial', 'critico', 'reto']) if (!p.ruta?.[k]?.length) errores.push(`${donde}: Ruta Lectora sin ${k}.`);
    const ops = (p.preguntas || []).filter((q) => q.tipo === 'opcion');
    const abiertas = (p.preguntas || []).filter((q) => q.tipo === 'abierta');
    if (ops.length < 3) errores.push(`${donde}: necesita 3 preguntas de opción.`);
    if (abiertas.length < 2) errores.push(`${donde}: necesita 2 preguntas abiertas.`);
    const texto = plano(p.parrafos.join(' '));
    for (const [i, q] of ops.entries()) {
      if (!(q.correcta >= 0 && q.correcta < q.opciones.length)) errores.push(`${donde} P${i + 1}: «correcta» fuera de rango.`);
      if (new Set(q.opciones).size !== q.opciones.length) errores.push(`${donde} P${i + 1}: opciones repetidas.`);
      if (!q.dondeLoDice && !q.porque) errores.push(`${donde} P${i + 1}: falta «dondeLoDice» o «porque».`);
      const cita = q.dondeLoDice ? plano(q.dondeLoDice).replace(/^[—\-«»"' ]+|[—\-«»"' ]+$/g, '').replace(/[.,;:!?]+$/, '') : '';
      if (cita && !texto.includes(cita.slice(0, 70))) errores.push(`${donde} P${i + 1}: «dondeLoDice» no está en el texto.`);
    }
    // Versión en inglés (opcional): mismas reglas de preguntas y citas sobre el texto en inglés.
    if (p.en) {
      const en = p.en;
      if (!en.titulo || !en.parrafos?.length) errores.push(`${donde} [en]: falta título o párrafos.`);
      if ((en.parrafos || []).length !== p.parrafos.length) errores.push(`${donde} [en]: tiene ${en.parrafos?.length} párrafos y el original ${p.parrafos.length}.`);
      const textoEn = plano((en.parrafos || []).join(' '));
      for (const [i, q] of (en.preguntas || []).filter((x) => x.tipo === 'opcion').entries()) {
        if (!(q.correcta >= 0 && q.correcta < q.opciones.length)) errores.push(`${donde} [en] P${i + 1}: «correcta» fuera de rango.`);
        const cita = q.dondeLoDice ? plano(q.dondeLoDice).replace(/^[—\-«»"“”' ]+|[—\-«»"“”' ]+$/g, '').replace(/[.,;:!?]+$/, '') : '';
        if (cita && !textoEn.includes(cita.slice(0, 70))) errores.push(`${donde} [en] P${i + 1}: «dondeLoDice» no está en el texto en inglés.`);
      }
      if (!en.estado) errores.push(`${donde} [en]: falta «estado» (nace «en revisión»).`);
    }
    // Ilustraciones (opcional): una escena por posición válida, con texto alternativo en ambos idiomas.
    for (const il of p.ilustraciones || []) {
      if (il.original && !existsSync(new URL('../public/ilus/' + il.original, import.meta.url))) errores.push(`${donde} ilustración ${il.n}: falta el archivo cifrado ${il.original}.`);
      if (!(il.despues >= -1 && il.despues < p.parrafos.length)) errores.push(`${donde} ilustración ${il.n}: «despues» fuera de rango.`);
      if ((!il.escena && !il.original) || !il.alt?.es || !il.alt?.en) errores.push(`${donde} ilustración ${il.n}: falta escena o texto alternativo.`);
    }
    for (const q of abiertas) if (!q.pista) errores.push(`${donde}: pregunta abierta sin pista.`);
    const b = p.brujula;
    if (!b?.emocion?.nombre || !b?.valor?.nombre || !b?.disciplina || !b?.innovar || !b?.conecta?.actividad) errores.push(`${donde}: Crecer incompleto.`);
    for (const id of b?.competencias || []) if (!compIds.has(id)) errores.push(`${donde}: competencia desconocida «${id}».`);
    if (!p.guiaFamilia?.pasos?.length) errores.push(`${donde}: sin pasos para la familia.`);
    if (!p.guiaDocente?.proposito) errores.push(`${donde}: sin guía docente.`);
    if (!p.voz?.intro || !p.voz?.cierre) errores.push(`${donde}: sin voz del Guardián.`);
    if (!p.reinventar?.length) errores.push(`${donde}: sin retos para reinventar.`);
  }
  for (const [g, info] of Object.entries(marco.planGrados?.grados || {})) for (const x of [...(info.lecturas || []), ...(info.recomendadas || [])]) if (!ids.has(x.id)) errores.push(`Plan de ${g}, semana ${x.semana}: el cuento «${x.id}» no existe en el libro.`);
  resumen += ` · libro válido: ${libro.paginas.length} páginas, ${n} cuentos y lecturas, ${libro.unidades.length} unidades`;
} else resumen += ' · (contenido/libro.json no está en este equipo: el libro se valida donde se arma)';

if (errores.length) { console.error('✗ Revisar:\n- ' + errores.join('\n- ')); process.exit(1); }
console.log('✓ ' + resumen + '.');
