// Valida el libro antes de publicar: node scripts/validar.mjs
// Los agentes (Dots) deben correrlo antes de abrir un pull request.
import { readFileSync } from 'node:fs';

const libro = JSON.parse(readFileSync(new URL('../public/data/cuentos.json', import.meta.url), 'utf8'));
const medios = JSON.parse(readFileSync(new URL('../public/data/medios.json', import.meta.url), 'utf8'));
const errores = [];
const ids = new Set();
const NIVELES_ABIERTOS = 2;

const compIds = new Set((libro.competencias?.lista || []).map((k) => k.id));
for (const k of libro.competencias?.lista || []) for (const g of libro.grados) if (!k.semillas?.[g]) errores.push(`Competencia ${k.nombre}: falta la semilla de ${g}.`);
const fuentes = new Set((libro.porQueLeer?.fuentes || []).map((f) => f.id));
for (const a of libro.porQueLeer?.areas || []) for (const x of a.beneficios) for (const id of x.fuente || []) if (!fuentes.has(id)) errores.push(`Por qué leer «${x.titulo}»: fuente desconocida ${id}.`);
for (const f of libro.porQueLeer?.fuentes || []) if (!f.doi && !f.nota) errores.push(`Fuente ${f.id}: sin DOI ni nota «por verificar».`);
if (/gimnasia cerebral|brain gym/i.test(JSON.stringify(libro))) errores.push('El libro menciona «gimnasia cerebral» (neuromito).');
if (!libro.revision?.estado) errores.push('Falta revision.estado (todo contenido nuevo nace «en revisión»).');
for (const c of libro.cuentos) {
  const donde = `«${c.titulo}» (${c.id})`;
  if (!Array.isArray(c.texto) || c.texto.length < 3) errores.push(`${donde}: texto muy corto o ausente.`);
  if (!c.vocabulario?.length) errores.push(`${donde}: falta vocabulario.`);
  for (const k of ['literal', 'inferencial', 'critico']) if (!c.rutaLectora?.[k]?.length) errores.push(`${donde}: Ruta Lectora sin ${k}.`);
  const ops = c.preguntas.filter((q) => q.tipo === 'opcion');
  const abiertas = c.preguntas.filter((q) => q.tipo === 'abierta');
  if (ops.length < 3) errores.push(`${donde}: necesita al menos 3 preguntas de opción.`);
  if (abiertas.length < NIVELES_ABIERTOS) errores.push(`${donde}: necesita al menos ${NIVELES_ABIERTOS} preguntas abiertas.`);
  for (const q of c.preguntas) {
    if (ids.has(q.id)) errores.push(`${donde}: id repetido ${q.id}.`);
    ids.add(q.id);
    if (q.tipo === 'opcion') {
      if (!(q.correcta >= 0 && q.correcta < q.opciones.length)) errores.push(`${q.id}: «correcta» fuera de rango.`);
      if (new Set(q.opciones).size !== q.opciones.length) errores.push(`${q.id}: opciones repetidas.`);
      if (!q.dondeLoDice && !q.porque) errores.push(`${q.id}: falta «dondeLoDice» o «porque».`);
      if (q.dondeLoDice) {
        const plano = (s) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, '').replace(/\s+/g, ' ').trim();
        const frag = plano(q.dondeLoDice).replace(/^—/, '').slice(0, 40);
        if (!plano(c.texto.join(' ')).includes(frag)) errores.push(`${q.id}: «dondeLoDice» no aparece en el texto del cuento.`);
      }
    }
    if (q.tipo === 'abierta' && !q.pista) errores.push(`${q.id}: pregunta abierta sin pista.`);
  }
  if (!c.reinventar?.length) errores.push(`${donde}: faltan retos para reinventar.`);
  const b = c.brujula;
  if (!b) errores.push(`${donde}: falta «brujula» (pestaña Crecer).`);
  else {
    if (!b.emocion?.nombre || !b.emocion?.estrategia) errores.push(`${donde}: Crecer sin emoción y estrategia.`);
    if (!b.valor?.nombre || !b.valor?.proposito) errores.push(`${donde}: Crecer sin valor con propósito.`);
    for (const k of ['disciplina', 'innovar']) if (!b[k]) errores.push(`${donde}: Crecer sin ${k}.`);
    if (!b.conecta?.area || !b.conecta?.actividad) errores.push(`${donde}: Crecer sin conexión entre áreas.`);
    for (const id of b.competencias || []) if (!compIds.has(id)) errores.push(`${donde}: competencia desconocida «${id}».`);
  }
  for (const k of ['proposito', 'competencias', 'actividad', 'errorFrecuente']) if (!c.guiaDocente?.[k]) errores.push(`${donde}: guía docente sin ${k}.`);
}
for (const m of medios.mural || []) {
  if (/\d{7,}|@/.test(`${m.firma} ${m.texto}`)) errores.push(`Mural «${m.titulo}»: parece tener teléfono o correo (Ley 1581).`);
}

if (errores.length) { console.error('✗ Revisar:\n- ' + errores.join('\n- ')); process.exit(1); }
console.log(`✓ Libro válido: ${libro.cuentos.length} cuentos, ${ids.size} preguntas.`);
