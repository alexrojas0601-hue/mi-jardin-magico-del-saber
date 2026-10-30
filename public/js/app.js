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
const inicial = { semillas: 0, hechas: {}, respuestas: {}, versiones: [], rol: 'estudiante', grado: '1.°', leidos: {}, pos: null, letra: 1.15, vozLenta: false, vozNombre: '', idioma: 'es', ilustrado: false };
let yo = cargar();
// Versión del libro elegida desde el portal (se recuerda en este equipo):
// ?v=es | en | es-ilus | en-ilus (idioma + imágenes) · ?v=texto | ilus (solo imágenes; conserva el idioma elegido).
(() => {
  const v = new URLSearchParams(location.search).get('v');
  if (/^(es|en)(-ilus)?$/.test(v || '')) { yo.idioma = v.slice(0, 2); yo.ilustrado = v.endsWith('-ilus'); }
  else if (v === 'texto' || v === 'ilus') yo.ilustrado = v === 'ilus';
  else return;
  try { localStorage.setItem(CLAVE, JSON.stringify(yo)); } catch { /* sin almacenamiento */ }
  history.replaceState(null, '', location.pathname + (location.hash || (yo.ilustrado ? '#mundo' : '')));
})();
function cargar() { try { return { ...inicial, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') }; } catch { return { ...inicial }; } }
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(yo)); } catch { /* sin almacenamiento: sigue en memoria */ } }

/* ---------- Interfaz en dos idiomas: t('clave') ----------
   Todo texto visible de la interfaz sale de aquí. El texto de los cuentos viene del libro (p.en). */
const enIngles = () => yo.idioma === 'en';
const L = () => (enIngles() ? 'en' : 'es');
const TXT = {
  es: {
    titulo: 'El Jardín Mágico del Saber', tituloHtml: 'El Jardín <span>Mágico</span> del Saber', eyebrow: 'SABI CENTEC · Libro interactivo',
    cargando: 'Abriendo el Jardín…', pie: 'Colegio CENTEC Córdoba · Cali', lema: '«El error no nos detiene: nos enseña, nos fortalece y nos hace crecer».',
    quienLee: '¿Quién lee?', grado: 'Grado', verArbol: 'Ver mi árbol de semillas', secciones: 'Secciones',
    navLibro: '📖 Leer el libro', navMundo: '🗺️ Mundo mágico', navGrado: '🎒 Mi grado', navIndice: 'Índice', navComp: 'Competencias', navPorQue: 'Por qué leer',
    cambiarIdioma: '🌐 English', cambiarIdiomaAria: 'Read in English',
    rolEst: 'Estudiante', rolFam: 'Familia', rolDoc: 'Docente',
    grados: { 'Transición': 'Transición', '1.°': '1.°', '2.°': '2.°', '3.°': '3.°' },
    etapas: ['Semilla', 'Brote', 'Plantita', 'Arbolito', 'Árbol en flor', 'Árbol de estrellas'],
    semillasDe: (n) => `semilla${n === 1 ? '' : 's'}`, arbolCrecio: (e) => `¡Tu árbol creció! Ahora es: ${e} 🌳`, masSemillas: (n) => `+${n} semilla${n > 1 ? 's' : ''} 🌱`,
    sinSonido: 'Este navegador no tiene sonido para la voz. Prueba con Chrome o Safari.', preparaLeer: 'El Guardián se prepara para leer… 🎙️',
    vozNoRespondio: 'La voz del Guardián no respondió; sigo con la voz del navegador.', guardianColores: 'El Guardián de los Colores',
    escuchar: 'Escuchar', detener: '⏸ Detener', noAbrir: 'No pudimos abrir el libro. Revisa tu conexión y recarga la página.',
    portada: 'Portada', finLibro: 'Fin del libro', semanas: (s) => `Semanas ${s}`, capEspecial: 'Capítulo especial', cuento: 'Cuento', lectura: 'Lectura',
    noIngles: '', enRevisionEn: 'English · en revisión', escucharCuento: '🔊 Escuchar el cuento', escucharPagina: '🔊 Escuchar esta página',
    rutaLectora: '🌟 Ruta Lectora CENTEC', nueva: 'nueva', palabras: '📖 Palabras para crecer', literal: '🔎 Leo y recuerdo', inferencial: '🤔 Pienso y descubro', critico: '💬 Opino y propongo', reto: '🏡 Reto en familia',
    noPagina: 'No pudimos traer esta página. Revisa la conexión.',
    pagAnterior: 'Página anterior', pagSiguiente: 'Página siguiente', anterior: '← Anterior', siguiente: 'Siguiente →',
    letraMenos: 'Letra más pequeña', letraMas: 'Letra más grande', conImagenes: '🖼️ Con imágenes', soloTexto: '📖 Solo texto', vozLenta: '🐢 Voz lenta', vozNormal: '🙂 Voz normal', indiceBtn: '☰ Índice',
    legalLibro: '© 2025 Editorial Pluma de Oro S.A.S. · Lectura en pantalla. Prohibida su copia, descarga o impresión.',
    leerDespacio: 'Voy a leer despacito.', leerNormal: 'Voy a leer normal.',
    hojaDe: (a, b) => `Hoja ${a} de ${b}`, paginaDe: (a, b) => `Página ${a} de ${b}`, cuentoDeGrado: (a, b, g) => `🎒 Cuento ${a} de ${b} de ${g}`,
    noGrabacion: 'No se pudo reproducir la grabación.',
    colegio: 'Colegio CENTEC Córdoba · Cali', subPortada: 'Cuentos y lecturas para aprender en familia · Transición a 3.°',
    seguir: 'Seguir donde quedé →', desdeInicio: 'Empezar desde el inicio', empezar: 'Empezar a leer →',
    pistaPasar: 'Para pasar la hoja, desliza de derecha a izquierda o toca el borde derecho. Para volver, al revés.', legalPortada: '© 2025 Editorial Pluma de Oro S.A.S. · Libro de lectura en pantalla.',
    llegasteFinal: '¡Llegaste al final del Jardín! 🌟', hasLeido: (a, b) => `Has leído ${a} de ${b} cuentos y lecturas. Cada uno es una semilla en tu Árbol del Saber.`,
    verMiArbol: 'Ver mi árbol', volverPortada: 'Volver a la portada',
    jugar: 'Jugar', pensar: 'Pensar', crecer: 'Crecer', reinventar: 'Reinventar',
    jugarSub: 'Preguntas para comprobar lo que entendí', pensarSub: 'Dar mi opinión con razones', crecerSub: 'Emoción, valor, disciplina e inventos', reinventarSub: 'Crear mi propia versión',
    acompanar: 'Para acompañar en casa', paso: (i) => `Paso ${i}.`, escucharPasos: '🔊 Escuchar los pasos', notaFamilia: 'No hace falta leer bien: toquen 🔊 y escuchen juntos. Sesiones cortas, de 10 a 15 minutos.',
    guiaDocente: 'Guía docente', enRevision: 'en revisión', proposito: 'Propósito:', actividad: 'Actividad de aula:', errorFrec: 'Error frecuente:', siembraEn: (g) => `Siembra en ${g}:`,
    dbaVerificar: 'DBA: por verificar con el docente de Lenguaje del grado.', guiaEnEspanol: '',
    tipTransicion: 'Pide a un adulto que juegue contigo. Toca 🔊 para escuchar cada pregunta.', tipOtros: 'Elige un juego. Si una pregunta es difícil, vuelve a leer el cuento: el error nos enseña.',
    aprendeJugando: '¡Ahora aprende jugando!', aprendeCuento: 'Aprende con este cuento', videoclip: '🎬 Ver el videoclip', cerrar: 'Cerrar',
    sinJuego: 'Este cuento todavía no tiene juego.', terminaste: '¡Terminaste el juego! Ahora pasa a <b>Pensar</b>: allí no hay respuestas únicas, hay buenas razones.', buenasDe: (a, b) => `${a} de ${b}`,
    irPensar: 'Ir a Pensar', otraVez: 'Jugar otra vez', preguntaDe: (a, b) => `Pregunta ${a} de ${b}`, opcion: (i, o) => `Opción ${i}: ${o}.`,
    muyBien: '¡Muy bien!', asiLoDice: (c) => `Así lo dice el cuento: «${c}»`, casi: 'Casi.', errorEnsena: 'El error no nos detiene: nos enseña.',
    buscaParte: 'Vuelve a mirar el cuento y busca la parte que lo dice.', piensaPersonajes: 'Piensa en lo que sintieron los personajes y elige otra.',
    pista: 'Pista:', tuRespuesta: 'Tu respuesta', phTransicion: 'Cuéntalo en voz alta; un adulto puede escribir lo que dices.', phEscribe: 'Escribe aquí con tus palabras…',
    guardarResp: 'Guardar mi respuesta', comenteGuardian: 'Que el Guardián me comente', nuevasPreg: 'Nuevas preguntas del Guardián', nuevasHint: (g) => `Preguntas distintas cada vez, a la medida de ${g}.`,
    pedir4: 'Pedir 4 preguntas nuevas', unPocoMas: 'Escribe un poquito más 🙂', respGuardada: 'Respuesta guardada', primeroEscribe: 'Primero escribe tu respuesta',
    guardianPiensa: 'El Guardián está pensando…', noLlegaron: 'No llegaron preguntas. Toca otra vez.', elGuardian: 'El Guardián', leyendoTuyo: 'Está leyendo lo que escribiste…', escucharGuardian: '🔊 Escuchar al Guardián',
    pronto: 'Pronto.', practicado: 'Practicado ✓', miCorazon: 'Mi corazón · Inteligencia emocional', cuandoSentido: '¿Cuándo has sentido algo así?',
    phSentirT: 'Cuéntalo o dibújalo; un adulto puede escribir.', phSentir: 'Escribe con tus palabras…', guardarEmocion: 'Guardar y nombrar mi emoción',
    valorProp: 'Valor con propósito', practiqueSemana: 'Lo practiqué esta semana', disciplina: 'Disciplina', cumpliHabito: 'Cumplí mi hábito',
    imaginarCrear: 'Imaginar, crear, innovar', dibujalo: 'Dibújalo o constrúyelo y cuéntaselo a tu familia o a tu profe.', conectaCon: (a) => `Conecta con · ${a}`,
    siembraCuento: (g) => `Lo que este cuento siembra en ${g}`, cuentanos: 'Cuéntanos un poquito 🙂',
    otroFinal: 'Inventa otro final para el cuento.', eligeReto: 'Elige tu reto', escribeVersion: 'Escribe tu versión. No hay una sola forma correcta: es tu imaginación.', habiaUnaVez: 'Había una vez…',
    guardarCuento: 'Guardar mi cuento', guardianLea: 'Que el Guardián lo lea', misReinventados: 'Mis cuentos reinventados', enviarWa: 'Enviar a CENTEC por WhatsApp',
    siNoWa: (n) => `Si el botón no abre WhatsApp, escribe al ${n}. Firma solo con tu nombre y grado.`, ningunoAun: 'Todavía no has guardado ninguno. ¡El primero siembra 3 semillas!',
    masCuento: 'Tu cuento necesita un poquito más 🙂', escribeCuento: 'Escribe tu cuento primero', locale: 'es-CO',
    compartir: (p, v) => `Cuento reinventado · El Jardín Mágico del Saber\nCuento: ${p}\nReto: ${v.consigna}\n\n${v.texto}\n\nFirma (solo nombre y grado): `,
    errNoDisp: 'El Guardián no está disponible en este momento. Puedes seguir con las preguntas del libro.', errMuchos: 'El Guardián está atendiendo a muchos niños. Intenta de nuevo en un ratico.',
    errRefused: 'El Guardián prefiere que volvamos al cuento. Intenta con otras palabras.', errOtro: 'No llegó la respuesta del Guardián. Toca el botón otra vez.',
    indiceLibro: 'Índice del libro', leidosDe: (a, b) => `${a} de ${b} leídos`, indiceLead: 'Toca un cuento para abrirlo en el libro. Cada uno trae su Ruta Lectora y su hoja «Aprende con este cuento» para jugar, pensar, crecer y reinventar.',
    abrirLibro: '📖 Abrir el libro', soloGrado: (g) => `🎒 Solo los cuentos de ${g}`, seguirCorto: 'Seguir donde quedé', paraEmpezar: 'Para empezar',
    dado: 'Dado de la imaginación', dadoHint: 'Lanza el dado y crea un cuento nuevo con lo que salga.', dadoToca: 'Toca el botón para lanzar.', lanzar: 'Lanzar el dado',
    dadoFrase: (a, b, c) => `Un día, ${a} llegó a ${b} y descubrió que ${c}. ¿Qué pasó después?`,
    inversion: 'Leer es la mejor inversión', inversionSub: 'Para familias y docentes: lo que gana un niño que lee todos los días.', mural: 'Mural de cuentos reinventados',
    muralVacio: (n) => `Aquí aparecerán los cuentos que niños y familias reinventen. Escribe el tuyo en «Reinventar» y envíalo a CENTEC por WhatsApp (<b>${n}</b>).`,
    miGrado: (g) => `🎒 Mi grado: ${g}`, gradoLead: (g) => `Aquí están los cuentos de ${g}, en el orden de las semanas del año. Al terminar uno, «Siguiente» te lleva al próximo cuento de tu grado.`,
    empezarGrado: (g) => `📖 Empezar a leer los cuentos de ${g}`, programados: '📅 Programados en la planeación', sinPlan: (g) => `La planeación 2027 de ${g} todavía no programa cuentos de este libro.`,
    recomendadas: (g) => `⭐ Lecturas recomendadas para ${g}`, invitaLeer: '¡Te invitamos a leer todo el libro!', invitaSub: 'Los cuentos de los demás grados también son para ti: cada uno trae su Ruta Lectora y sus juegos para aprender.',
    progLabel: 'Programados:', recoLabel: 'Recomendadas:', planInst: 'Planeación institucional', semana: (n) => `Semana ${n}`, periodo: (n) => `Período ${n}`, cuentoN: (a, b) => `Cuento ${a} de ${b}`,
    miArbol: 'Mi Árbol del Saber', nSemillas: (n) => `${n} semillas`, tuArbolEs: (e) => `tu árbol es un <b>${e}</b>.`, faltan: (n, e) => `Te faltan ${n} semillas para llegar a ${e}.`,
    cima: '¡Llegaste a la cima! Ahora ayuda a alguien más a sembrar su árbol.', comoSemillas: 'Cómo se ganan semillas',
    reglas: ['Terminar de leer un cuento o una lectura: 1 semilla.', 'Acertar en «Jugar»: 2 semillas al primer intento, 1 si lo logras después de equivocarte.', 'Escribir tu respuesta en «Pensar»: 2 semillas.', 'Practicar lo de «Crecer»: 2 semillas cada cosa.', 'Reinventar un cuento: 3 semillas.'],
    llevas: (a, b, n) => `Llevas ${a} de ${b} cuentos y lecturas y ${n} cuento${n === 1 ? '' : 's'} reinventado${n === 1 ? '' : 's'}. Tus semillas viven en este dispositivo; nadie más las ve.`,
    enRevisionMay: 'En revisión', compLead: 'El objetivo es que cada niño se enamore de leer y llegue a ser un lector experto.', mostrandoSemillas: (g) => `Mostrando las semillas de <b>${g}</b>. Cambia el grado arriba.`,
    metaExperto: 'Meta del lector experto:', semillaEn: (g) => `Semilla en ${g}`, comoSiembra: 'Cómo la siembra el libro:',
    comoEmpieza: 'Cómo empieza en el Jardín', evidencia: 'Evidencia:', fuentes: 'Fuentes', doiVerificar: 'DOI por verificar',
    soloPantalla: 'Este libro es de lectura en pantalla 📖', noImprime: 'Este libro no se imprime: es de lectura en pantalla.',
    mundoTitulo: '🗺️ El Mundo Mágico del Saber', mundoLead: 'Sigue el camino. Toca un lugar para entrar a sus cuentos.', finCamino: '🏁 ¡Fin del camino!', cuentosLeidos: 'cuentos leídos', misEmociones: 'Mis emociones',
  },
  en: {
    titulo: 'The Magic Garden of Knowledge', tituloHtml: 'The <span>Magic</span> Garden of Knowledge', eyebrow: 'SABI CENTEC · Interactive book',
    cargando: 'Opening the Garden…', pie: 'CENTEC Córdoba School · Cali', lema: '«Mistakes do not stop us: they teach us, make us stronger and help us grow».',
    quienLee: 'Who is reading?', grado: 'Grade', verArbol: 'See my seed tree', secciones: 'Sections',
    navLibro: '📖 Read the book', navMundo: '🗺️ Magic World', navGrado: '🎒 My grade', navIndice: 'Contents', navComp: 'Competencies', navPorQue: 'Why read',
    cambiarIdioma: '🌐 Español', cambiarIdiomaAria: 'Leer en español',
    rolEst: 'Student', rolFam: 'Family', rolDoc: 'Teacher',
    grados: { 'Transición': 'Kindergarten', '1.°': 'Grade 1', '2.°': 'Grade 2', '3.°': 'Grade 3' },
    etapas: ['Seed', 'Sprout', 'Little plant', 'Little tree', 'Tree in bloom', 'Tree of stars'],
    semillasDe: (n) => `seed${n === 1 ? '' : 's'}`, arbolCrecio: (e) => `Your tree grew! Now it is: ${e} 🌳`, masSemillas: (n) => `+${n} seed${n > 1 ? 's' : ''} 🌱`,
    sinSonido: 'This browser has no sound for the voice. Try Chrome or Safari.', preparaLeer: 'The Guardian is getting ready to read… 🎙️',
    vozNoRespondio: 'The Guardian\'s voice did not answer; I will go on with the browser\'s voice.', guardianColores: 'The Guardian of Colors',
    escuchar: 'Listen', detener: '⏸ Stop', noAbrir: 'We could not open the book. Check your connection and reload the page.',
    portada: 'Cover', finLibro: 'End of the book', semanas: (s) => `Weeks ${s}`, capEspecial: 'Special chapter', cuento: 'Story', lectura: 'Reading',
    noIngles: '🌐 This story is not in English yet. Here it is in Spanish.', enRevisionEn: 'English · under review', escucharCuento: '🔊 Listen to the story', escucharPagina: '🔊 Listen to this page',
    rutaLectora: '🌟 CENTEC Reading Path', nueva: 'new', palabras: '📖 Words to grow', literal: '🔎 I read and remember', inferencial: '🤔 I think and discover', critico: '💬 I give my opinion and suggest', reto: '🏡 Family challenge',
    noPagina: 'We could not load this page. Check the connection.',
    pagAnterior: 'Previous page', pagSiguiente: 'Next page', anterior: '← Back', siguiente: 'Next →',
    letraMenos: 'Smaller text', letraMas: 'Bigger text', conImagenes: '🖼️ With pictures', soloTexto: '📖 Text only', vozLenta: '🐢 Slow voice', vozNormal: '🙂 Normal voice', indiceBtn: '☰ Contents',
    legalLibro: '© 2025 Editorial Pluma de Oro S.A.S. · On-screen reading. Copying, downloading or printing is not allowed.',
    leerDespacio: 'I will read slowly.', leerNormal: 'I will read at a normal speed.',
    hojaDe: (a, b) => `Sheet ${a} of ${b}`, paginaDe: (a, b) => `Page ${a} of ${b}`, cuentoDeGrado: (a, b, g) => `🎒 Story ${a} of ${b} for ${g}`,
    noGrabacion: 'The recording could not be played.',
    colegio: 'CENTEC Córdoba School · Cali', subPortada: 'Stories and readings to learn as a family · Kindergarten to Grade 3',
    seguir: 'Continue where I stopped →', desdeInicio: 'Start from the beginning', empezar: 'Start reading →',
    pistaPasar: 'To turn the page, swipe from right to left or tap the right edge. To go back, do the opposite.', legalPortada: '© 2025 Editorial Pluma de Oro S.A.S. · On-screen reading book.',
    llegasteFinal: 'You reached the end of the Garden! 🌟', hasLeido: (a, b) => `You have read ${a} of ${b} stories and readings. Each one is a seed in your Tree of Knowledge.`,
    verMiArbol: 'See my tree', volverPortada: 'Back to the cover',
    jugar: 'Play', pensar: 'Think', crecer: 'Grow', reinventar: 'Reinvent',
    jugarSub: 'Questions to check what I understood', pensarSub: 'Give my opinion with reasons', crecerSub: 'Emotion, value, discipline and inventions', reinventarSub: 'Create my own version',
    acompanar: 'To help at home', paso: (i) => `Step ${i}.`, escucharPasos: '🔊 Listen to the steps', notaFamilia: 'You do not need to read well: tap 🔊 and listen together. Short sessions, 10 to 15 minutes.',
    guiaDocente: 'Teacher guide', enRevision: 'under review', proposito: 'Purpose:', actividad: 'Classroom activity:', errorFrec: 'Common mistake:', siembraEn: (g) => `What it plants in ${g}:`,
    dbaVerificar: 'DBA (Colombian learning standards): to be checked with the grade\'s Language teacher.', guiaEnEspanol: 'The guide is still in Spanish.',
    tipTransicion: 'Ask an adult to play with you. Tap 🔊 to listen to each question.', tipOtros: 'Choose a game. If a question is hard, read the story again: mistakes teach us.',
    aprendeJugando: 'Now learn by playing!', aprendeCuento: 'Learn with this story', videoclip: '🎬 Watch the video clip', cerrar: 'Close',
    sinJuego: 'This story does not have a game yet.', terminaste: 'You finished the game! Now go to <b>Think</b>: there are no single answers there, there are good reasons.', buenasDe: (a, b) => `${a} of ${b}`,
    irPensar: 'Go to Think', otraVez: 'Play again', preguntaDe: (a, b) => `Question ${a} of ${b}`, opcion: (i, o) => `Option ${i}: ${o}.`,
    muyBien: 'Well done!', asiLoDice: (c) => `This is what the story says: «${c}»`, casi: 'Almost.', errorEnsena: 'Mistakes do not stop us: they teach us.',
    buscaParte: 'Look at the story again and find the part that says it.', piensaPersonajes: 'Think about what the characters felt and choose another one.',
    pista: 'Hint:', tuRespuesta: 'Your answer', phTransicion: 'Say it out loud; an adult can write what you say.', phEscribe: 'Write here in your own words…',
    guardarResp: 'Save my answer', comenteGuardian: 'Ask the Guardian to comment', nuevasPreg: 'New questions from the Guardian', nuevasHint: (g) => `Different questions every time, made for ${g}.`,
    pedir4: 'Ask for 4 new questions', unPocoMas: 'Write a little bit more 🙂', respGuardada: 'Answer saved', primeroEscribe: 'First write your answer',
    guardianPiensa: 'The Guardian is thinking…', noLlegaron: 'No questions arrived. Tap again.', elGuardian: 'The Guardian', leyendoTuyo: 'Reading what you wrote…', escucharGuardian: '🔊 Listen to the Guardian',
    pronto: 'Coming soon.', practicado: 'Practiced ✓', miCorazon: 'My heart · Emotional intelligence', cuandoSentido: 'When have you felt something like this?',
    phSentirT: 'Tell it or draw it; an adult can write.', phSentir: 'Write in your own words…', guardarEmocion: 'Save and name my emotion',
    valorProp: 'A value with a purpose', practiqueSemana: 'I practiced it this week', disciplina: 'Discipline', cumpliHabito: 'I kept my habit',
    imaginarCrear: 'Imagine, create, innovate', dibujalo: 'Draw it or build it and tell your family or your teacher about it.', conectaCon: (a) => `Connect with · ${a}`,
    siembraCuento: (g) => `What this story plants in ${g}`, cuentanos: 'Tell us a little bit 🙂',
    otroFinal: 'Invent another ending for the story.', eligeReto: 'Choose your challenge', escribeVersion: 'Write your version. There is no single right way: it is your imagination.', habiaUnaVez: 'Once upon a time…',
    guardarCuento: 'Save my story', guardianLea: 'Ask the Guardian to read it', misReinventados: 'My reinvented stories', enviarWa: 'Send to CENTEC by WhatsApp',
    siNoWa: (n) => `If the button does not open WhatsApp, write to ${n}. Sign only with your first name and grade.`, ningunoAun: 'You have not saved any yet. The first one plants 3 seeds!',
    masCuento: 'Your story needs a little bit more 🙂', escribeCuento: 'Write your story first', locale: 'en-US',
    compartir: (p, v) => `Reinvented story · The Magic Garden of Knowledge\nStory: ${p}\nChallenge: ${v.consigna}\n\n${v.texto}\n\nSignature (first name and grade only): `,
    errNoDisp: 'The Guardian is not available right now. You can go on with the questions in the book.', errMuchos: 'The Guardian is helping many children. Try again in a little while.',
    errRefused: 'The Guardian would rather go back to the story. Try with other words.', errOtro: 'The Guardian\'s answer did not arrive. Tap the button again.',
    indiceLibro: 'Table of contents', leidosDe: (a, b) => `${a} of ${b} read`, indiceLead: 'Tap a story to open it in the book. Each one has its Reading Path and its «Learn with this story» page to play, think, grow and reinvent.',
    abrirLibro: '📖 Open the book', soloGrado: (g) => `🎒 Only the stories for ${g}`, seguirCorto: 'Continue where I stopped', paraEmpezar: 'To begin',
    dado: 'Imagination dice', dadoHint: 'Roll the dice and create a new story with what comes up.', dadoToca: 'Tap the button to roll.', lanzar: 'Roll the dice',
    dadoFrase: (a, b, c) => `One day, ${a} arrived at ${b} and found out that ${c}. What happened next?`,
    inversion: 'Reading is the best investment', inversionSub: 'For families and teachers: what a child who reads every day gains.', mural: 'Wall of reinvented stories',
    muralVacio: (n) => `The stories that children and families reinvent will appear here. Write yours in «Reinvent» and send it to CENTEC by WhatsApp (<b>${n}</b>).`,
    miGrado: (g) => `🎒 My grade: ${g}`, gradoLead: (g) => `Here are the stories for ${g}, in the order of the weeks of the year. When you finish one, «Next» takes you to the next story for your grade.`,
    empezarGrado: (g) => `📖 Start reading the stories for ${g}`, programados: '📅 Scheduled in the school plan', sinPlan: (g) => `The 2027 plan for ${g} does not schedule stories from this book yet.`,
    recomendadas: (g) => `⭐ Recommended readings for ${g}`, invitaLeer: 'We invite you to read the whole book!', invitaSub: 'The stories for the other grades are for you too: each one has its Reading Path and its games to learn.',
    progLabel: 'Scheduled:', recoLabel: 'Recommended:', planInst: 'School plan', semana: (n) => `Week ${n}`, periodo: (n) => `Term ${n}`, cuentoN: (a, b) => `Story ${a} of ${b}`,
    miArbol: 'My Tree of Knowledge', nSemillas: (n) => `${n} seed${n === 1 ? '' : 's'}`, tuArbolEs: (e) => `your tree is a <b>${e}</b>.`, faltan: (n, e) => `You need ${n} more seed${n === 1 ? '' : 's'} to reach ${e}.`,
    cima: 'You reached the top! Now help someone else plant their tree.', comoSemillas: 'How to earn seeds',
    reglas: ['Finish reading a story or a reading: 1 seed.', 'Get it right in «Play»: 2 seeds on the first try, 1 if you get it after a mistake.', 'Write your answer in «Think»: 2 seeds.', 'Practice what «Grow» suggests: 2 seeds for each thing.', 'Reinvent a story: 3 seeds.'],
    llevas: (a, b, n) => `You have read ${a} of ${b} stories and readings and reinvented ${n} stor${n === 1 ? 'y' : 'ies'}. Your seeds live on this device; nobody else sees them.`,
    enRevisionMay: 'Under review', compLead: 'The goal is for every child to fall in love with reading and become an expert reader.', mostrandoSemillas: (g) => `Showing the seeds for <b>${g}</b>. Change the grade above.`,
    metaExperto: 'Expert reader goal:', semillaEn: (g) => `Seed in ${g}`, comoSiembra: 'How the book plants it:',
    comoEmpieza: 'How it starts in the Garden', evidencia: 'Evidence:', fuentes: 'Sources', doiVerificar: 'DOI to be verified',
    soloPantalla: 'This book is for on-screen reading 📖', noImprime: 'This book cannot be printed: it is for on-screen reading.',
    mundoTitulo: '🗺️ The Magic World of Knowledge', mundoLead: 'Follow the path. Tap a place to enter its stories.', finCamino: '🏁 The end of the path!', cuentosLeidos: 'stories read', misEmociones: 'My feelings',
  },
};
function t(clave, ...args) {
  const v = TXT[L()][clave] ?? TXT.es[clave];
  return typeof v === 'function' ? v(...args) : v ?? clave;
}
const gradoNom = (g) => t('grados')[g] || g;
// Niveles de las preguntas del libro (etiquetas de interfaz): en inglés cuando la interfaz está en inglés.
const NIVEL_EN = { Literal: 'Literal', Inferencial: 'Inferential', 'Crítico': 'Critical', Creativo: 'Creative', 'Palabras en contexto': 'Words in context', 'Símbolos': 'Symbols', 'Orden y causas': 'Order and causes', Comparar: 'Compare', 'Finanzas para la vida': 'Finance for life', 'Científico': 'Scientific', 'Sonidos y rimas': 'Sounds and rhymes' };
const nivelNom = (n) => (enIngles() ? NIVEL_EN[n] || n : n);
// Texto de un idioma concreto (para la voz cuando el contenido está en otro idioma que la interfaz).
function tl(lg, clave, ...args) { const v = TXT[lg][clave] ?? TXT.es[clave]; return typeof v === 'function' ? v(...args) : v; }
// Contenido que sigue en español dentro de la interfaz en inglés (títulos de cuentos, guías): se marca lang="es".
const enEs = (html) => (enIngles() ? `<span lang="es">${html}</span>` : html);

function sumar(n, id) {
  if (id) { if (yo.hechas[id]) return 0; yo.hechas[id] = true; }
  const antes = etapa(yo.semillas).i;
  yo.semillas += n; guardar(); pintarChip();
  const ahora = etapa(yo.semillas);
  aviso(ahora.i > antes ? t('arbolCrecio', ahora.nombre) : t('masSemillas', n));
  return n;
}

/* ---------- Árbol del Saber ---------- */
const ETAPAS = [{ min: 0 }, { min: 5 }, { min: 15 }, { min: 30 }, { min: 50 }, { min: 80 }];
const nombreEtapa = (k) => t('etapas')[k];
function etapa(n) { let i = 0; ETAPAS.forEach((e, k) => { if (n >= e.min) i = k; }); return { i, min: ETAPAS[i].min, nombre: nombreEtapa(i), sig: ETAPAS[i + 1] && { min: ETAPAS[i + 1].min, nombre: nombreEtapa(i + 1) } }; }
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
  $('#treeChip').innerHTML = `${arbolSVG(e.i)}<span><b>${yo.semillas}</b><small>${t('semillasDe', yo.semillas)} · ${e.nombre}</small></span>`;
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
// Versión en inglés: si el lector eligió English y el cuento ya está traducido, se usan sus textos
// (las guías para docentes y familias siguen en español).
function localizar(p) {
  if (!p) return p;
  if (yo.idioma === 'en' && p.en?.parrafos?.length) { const { en, ...resto } = p; return { ...resto, ...en, idiomaActivo: 'en', estadoEn: en.estado || '', idiomaGuias: en.guiaFamilia || en.guiaDocente ? 'en' : 'es' }; }
  return { ...p, idiomaActivo: 'es', idiomaGuias: 'es' };
}
function traerPagina(id) {
  if (!cachePaginas.has(id)) cachePaginas.set(id, api('pagina/' + id).then((p) => { if (p?.en?.titulo && p.en.parrafos?.length) titulosEn.set(id, p.en.titulo); return p; }).catch((e) => { cachePaginas.delete(id); throw e; }));
  return cachePaginas.get(id);
}

/* ---------- Voz del Guardián: narración para niños ----------
   Motor principal: voz neuronal en español generada en el servidor (/api/voz, Aura-2 de Cloudflare),
   reproducida con Web Audio y volumen reforzado. Respaldo: la voz del navegador. */
const AC = window.AudioContext || window.webkitAudioContext;
const VOZ_NARRADORA = 'celeste'; // colombiana, clara y entusiasta
const VOZ_GUARDIAN = 'sirio';    // barítono calmado: el Guardián de los Colores
const VOZ_NARRADORA_EN = 'asteria'; // inglés: narradora clara (Aura-2 EN)
const VOZ_GUARDIAN_EN = 'orion';    // inglés: el Guardián
const VOCES_EN = [VOZ_NARRADORA_EN, VOZ_GUARDIAN_EN];
const idiomaPagina = () => (vista?.pagina?.datos?.idiomaActivo === 'en' ? 'en' : 'es');
const vozDe = (rol, idioma) => (idioma === 'en' ? (rol === 'guardian' ? VOZ_GUARDIAN_EN : VOZ_NARRADORA_EN) : (rol === 'guardian' ? VOZ_GUARDIAN : VOZ_NARRADORA));
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
    const p = fetch(`./api/voz?v=${quien}${VOCES_EN.includes(quien) ? '&l=en' : ''}&t=${encodeURIComponent(t)}`, { headers: { 'x-jardin': 'lector' } })
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
  if (!voz.disponible) { aviso(t('sinSonido')); return; }
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
          if (i === 0) aviso(t('preparaLeer'));
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
        aviso(t('vozNoRespondio'));
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
    const v = VOCES_EN.includes(f.quien) ? null : elegirVoz(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = VOCES_EN.includes(f.quien) ? 'en-US' : 'es-CO';
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
function decir(texto, idioma = 'es') { narrar(fragmentar(texto).map((t) => ({ texto: t, quien: vozDe('narradora', idioma) }))); }
// Fragmentos de una oración, uniendo las muy cortas (Aura-2 entona mejor frases completas).
function fragmentar(texto) {
  const out = [];
  for (const f of frasesDe(texto)) { if (out.length && limpiarHabla(out[out.length - 1]).length < 40) out[out.length - 1] += ' ' + f; else out.push(f); }
  return out;
}
function actualizarBotonesVoz() {
  $$('[data-narrar]').forEach((b) => { b.textContent = voz.activa ? t('detener') : b.dataset.etq; b.setAttribute('aria-pressed', voz.activa); });
}
function quitarResaltado() { $$('.s.leyendo').forEach((x) => x.classList.remove('leyendo')); }
function burbuja(texto) {
  let b = $('.burbuja');
  if (!texto) { if (b) b.hidden = true; return; }
  if (!b) { b = document.createElement('div'); b.className = 'burbuja'; b.setAttribute('aria-live', 'polite'); document.body.append(b); }
  b.innerHTML = `<span class="burbuja-quien">${esc(t('guardianColores'))}</span>${esc(sinEmoji(texto))}`; b.hidden = false;
}
// idioma: el de la voz que lee. Por defecto, en el libro el del cuento y fuera de él el de la interfaz.
const botonVoz = (texto, etiqueta = '🔊', idioma = '') => `<button class="oir" type="button" data-decir="${esc(sinEmoji(texto))}"${idioma ? ` data-idioma="${idioma}"` : ''} aria-label="${esc(t('escuchar'))}" title="${esc(t('escuchar'))}">${etiqueta}</button>`;
const idiomaVoz = () => (enLibro() ? idiomaPagina() : L());
document.addEventListener('click', (e) => { const b = e.target.closest('[data-decir]'); if (b) { e.preventDefault(); e.stopPropagation(); decir(b.dataset.decir, b.dataset.idioma || idiomaVoz()); } }, true);
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch { /* nada */ } }
if (AC) fetch('./api/voz?estado=1').then((r) => r.json()).then((j) => { if (!j.ok) voz.motor = 'navegador'; }).catch(() => { voz.motor = 'navegador'; });

/* ---------- Datos ---------- */
let marco, medios, indice;
// marco.json trae el español y, en marco.en, la versión en inglés (mismos ids). Estas funciones dan el texto en el idioma elegido.
const mEn = () => (enIngles() ? marco.en || {} : null);
function competencias() {
  const C = marco.competencias; const E = mEn()?.competencias; if (!E) return C;
  return { ...C, titulo: E.titulo || C.titulo, nota: E.nota || C.nota,
    familias: C.familias.map((f) => ({ ...f, nombre: E.familias?.[f.id] || f.nombre })),
    lista: C.lista.map((k) => { const e = E.lista?.[k.id] || {}; return { ...k, ...e, semillas: { ...k.semillas, ...(e.semillas || {}) } }; }) };
}
const compDe = (id) => competencias().lista.find((x) => x.id === id);
function porQueLeer() {
  const P = marco.porQueLeer; const E = mEn()?.porQueLeer; if (!E) return P;
  return { ...P, titulo: E.titulo || P.titulo, intro: E.intro || P.intro,
    areas: P.areas.map((a) => { const e = E.areas?.[a.id] || {}; return { ...a, nombre: e.nombre || a.nombre, beneficios: a.beneficios.map((x, i) => ({ ...x, ...(e.beneficios?.[i] || {}) })) }; }),
    habito: { ...P.habito, ...(E.habito || {}) },
    fuentes: P.fuentes.map((f) => ({ ...f, nota: f.nota && (E.notas?.[f.nota] || f.nota) })) };
}
const dado = () => ({ ...marco.dadoImaginacion, ...(mEn()?.dadoImaginacion || {}) });
function planGrados() {
  const P = marco.planGrados || { grados: {} }; const E = mEn()?.planGrados; if (!E) return P;
  const fila = (x) => ({ ...x, uso: x.uso && (E.usos?.[x.uso] || x.uso), tema: x.tema && (E.temas?.[x.tema] || x.tema) });
  return { ...P, nota: E.nota || P.nota, notaRecomendadas: E.notaRecomendadas || P.notaRecomendadas,
    grados: Object.fromEntries(Object.entries(P.grados).map(([g, i]) => [g, { ...i, fuente: E.fuentes?.[i.fuente] || i.fuente, lecturas: (i.lecturas || []).map(fila), recomendadas: (i.recomendadas || []).map(fila) }])) };
}
let guardian = { modo: null };
const vista = { pagina: null, hojas: [], hoja: 0, ocupado: false, aprende: null };
// Lectura por grado: si el niño entró desde «Mi grado», «Siguiente» lo lleva al próximo cuento programado.
let rutaGrado = null; // { grado, ids: [] }

async function iniciar() {
  pintarMarco(); // encabezado, pie y «Abriendo…» en el idioma elegido desde el primer instante
  const cargando = $('#app .loading'); if (cargando) cargando.textContent = t('cargando');
  try {
    [marco, medios] = await Promise.all([
      fetch('./data/marco.json').then((r) => r.json()),
      fetch('./data/medios.json').then((r) => r.json()).catch(() => ({ videos: {}, mural: [], audios: {} })),
    ]);
    indice = await api('indice');
    (indice.paginas || []).forEach((x) => { if (x.tituloEn) titulosEn.set(x.id, x.tituloEn); });
  } catch {
    $('#app').innerHTML = `<div class="empty">${esc(t('noAbrir'))}</div>`;
    return;
  }
  armarSecuencia();
  pintarMarco(); pintarControles(); pintarChip(); proteger();
  window.addEventListener('hashchange', rutear);
  window.addEventListener('resize', () => { clearTimeout(vista.tr); vista.tr = setTimeout(() => { if (vista.pagina && enLibro()) mostrarPagina(vista.pagina.id, vista.hoja, 0, true); }, 250); });
  rutear();
  iniciarGuardian();
}

/* Secuencia del libro: portada, presentación, portada de cada semana, cuentos y lecturas, fin. */
let secuencia = [];
function armarSecuencia() {
  const U = Object.fromEntries((indice.unidades || []).map((u) => [u.clave, u]));
  secuencia = [{ id: 'portada', tipo: 'portada', titulo: 'Portada' }]; // los títulos de portada, unidad y fin se traducen con tituloItem()
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
const etiquetaUnidad = (u) => (u ? (u.clave === 'ce' ? t('capEspecial') : t('semanas', u.semanas)) : '');
// Nombre de una unidad en el idioma de la interfaz (UNIDAD_EN está más abajo, con el mapa).
const nombreUnidad = (u) => (!u ? '' : enIngles() ? (UNIDAD_EN[u.clave] || u.titulo || etiquetaUnidad(u)) : (u.titulo || etiquetaUnidad(u)));
// Título de un cuento en listas: en inglés si el libro ya lo trae (página en caché); si no, el original marcado lang="es".
const titulosEn = new Map();
const tituloCuento = (x) => { const en = enIngles() && titulosEn.get(x.id); return en ? esc(en) : enIngles() ? `<span lang="es" data-tt="${esc(x.id)}">${esc(x.titulo)}</span>` : esc(x.titulo); };
// El índice del Worker trae solo el título original: en inglés, los títulos de las listas se cambian
// apenas llega la página traducida (de a 4 páginas a la vez, y solo mientras la vista siga en pantalla).
let tandaTitulos = 0;
async function traducirTitulos() {
  if (!enIngles()) return;
  const tanda = ++tandaTitulos;
  const ids = [...new Set($$('[data-tt]').map((el) => el.dataset.tt))].filter((id) => !titulosEn.has(id));
  const poner = (id) => { const en = titulosEn.get(id); if (!en) return; $$(`[data-tt="${CSS.escape(id)}"]`).forEach((el) => { el.textContent = en; el.removeAttribute('lang'); el.removeAttribute('data-tt'); }); };
  [...new Set($$('[data-tt]').map((el) => el.dataset.tt))].forEach(poner);
  const trabajo = async () => { while (ids.length) { if (tanda !== tandaTitulos || !enIngles()) return; const id = ids.shift(); try { await traerPagina(id); } catch { /* sigue en español */ } poner(id); } };
  await Promise.all([trabajo(), trabajo(), trabajo(), trabajo()]);
}
// Título que se muestra de cada elemento de la secuencia (portada, unidad y fin cambian con el idioma).
const tituloItem = (x) => (x.tipo === 'portada' ? t('portada') : x.tipo === 'fin' ? t('finLibro') : x.tipo === 'unidad' ? nombreUnidad(x.unidad) : x.titulo);

/* ---------- Navegación general ---------- */
/* Textos fijos de la página (encabezado, pie, título de la pestaña) en el idioma de la interfaz. */
function pintarMarco() {
  document.documentElement.lang = enIngles() ? 'en' : 'es-CO';
  document.title = t('titulo');
  const h1 = $('.brand h1'); if (h1) h1.innerHTML = t('tituloHtml');
  const eb = $('.band .eyebrow'); if (eb) eb.textContent = t('eyebrow');
  $('#roles')?.setAttribute('aria-label', t('quienLee'));
  const lg = $('label[for="grado"]'); if (lg) lg.textContent = t('grado');
  $('#grado')?.setAttribute('aria-label', t('grado'));
  $('#treeChip')?.setAttribute('aria-label', t('verArbol'));
  $('nav.topnav')?.setAttribute('aria-label', t('secciones'));
  const pie = $('footer .wrap');
  if (pie) pie.innerHTML = `<span>${esc(t('pie'))} · <a href="https://www.sabicentec.com" target="_blank" rel="noopener">sabicentec.com</a></span><span>${esc(t('lema'))}</span>`;
}
function pintarControles() {
  $('#nav').innerHTML = [['libro', '#libro', t('navLibro')], ['mundo', '#mundo', t('navMundo')], ['grado', '#grado', t('navGrado')], ['indice', '#indice', t('navIndice')], ['competencias', '#competencias', t('navComp')], ['por-que-leer', '#por-que-leer', t('navPorQue')]]
    .map(([id, href, n]) => `<a href="${href}" data-nav="${id}">${n}</a>`).join('');
  const roles = [['estudiante', t('rolEst')], ['familia', t('rolFam')], ['docente', t('rolDoc')]];
  $('#roles').innerHTML = roles.map(([v, n]) => `<button type="button" data-rol="${v}" aria-pressed="${yo.rol === v}">${n}</button>`).join('');
  $('#roles').onclick = (e) => { const b = e.target.closest('[data-rol]'); if (!b) return; yo.rol = b.dataset.rol; guardar(); pintarControles(); refrescar(); };
  const sel = $('#grado');
  sel.innerHTML = marco.grados.map((g) => `<option value="${esc(g)}" ${g === yo.grado ? 'selected' : ''}>${esc(gradoNom(g))}</option>`).join('');
  sel.onchange = () => { yo.grado = sel.value; guardar(); refrescar(); };
  $('#treeChip').onclick = () => { location.hash = 'arbol'; };
  const h = decodeURIComponent(location.hash.slice(1));
  marcarNav(enLibro() ? 'libro' : /^grado/.test(h) ? 'grado' : ['mundo', 'competencias', 'por-que-leer'].includes(h) ? h : ['arbol', 'revisar'].includes(h) ? '' : 'indice');
}
// Cambiar de idioma: se repinta todo lo que está en pantalla (encabezado, menú, pie y la vista actual).
function cambiarIdioma(nuevo) {
  callar(); yo.idioma = nuevo; guardar();
  pintarMarco(); pintarControles(); pintarChip();
  if (enLibro() && vista.pagina) mostrarPagina(vista.pagina.id, 0, 0, true); else rutear();
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
    if (!id) { id = 'portada'; hoja = 0; rutaGrado = null; }
    if (rutaGrado && !rutaGrado.ids.includes(id)) rutaGrado = null;
    if (posDe(id) < 0) { id = 'portada'; hoja = 0; }
    mostrarPagina(id, hoja, 0);
    return;
  }
  document.body.classList.remove('modo-libro'); fondoTema('jardin');
  const g = /^grado(?:\/(.+))?$/.exec(h);
  if (g) { marcarNav('grado'); pintarGrado(g[1]); }
  else if (h === 'arbol') { marcarNav(''); pintarArbol(); }
  else if (h === 'revisar') { marcarNav(''); pintarRevision(); }
  else if (h === 'mundo') { marcarNav('mundo'); pintarMundo(); }
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
  const ilus0 = yo.ilustrado ? (p.ilustraciones || []).filter((il) => il.aprobada) : [];
  const ancha = matchMedia('(min-width: 760px) and (orientation: landscape)').matches;
  const ladoPortada = ancha ? Math.max(150, Math.min(260, Math.round(medidas().alto * 0.42))) : Math.max(150, Math.min(300, Math.round(medidas().alto * 0.36)));
  const portada = ilus0.find((il) => il.despues < 0);
  const figPortada = portada ? `<figure class="ilus portada-ilus"><img style="width:min(100%,${ladoPortada}px)" src="./api/ilustracion/${encodeURIComponent(p.id)}/${portada.n}" alt="${esc((portada.alt || {})[p.idiomaActivo] || (portada.alt || {}).es || '')}" width="1024" height="1024" decoding="async" draggable="false"></figure>` : '';
  B.push({ tipo: 'cabeza', html: cabezaPagina(item, p, figPortada, ancha) });
  const ilus = yo.ilustrado ? (p.ilustraciones || []).filter((il) => il.aprobada) : [];
  const ladoIlus = Math.max(140, Math.min(300, Math.round(medidas().alto * 0.33)));
  const figura = (il) => B.push({ tipo: 'html', html: `<figure class="ilus"><img style="width:min(100%,${ladoIlus}px)" src="./api/ilustracion/${encodeURIComponent(p.id)}/${il.n}" alt="${esc((il.alt || {})[p.idiomaActivo] || (il.alt || {}).es || '')}" width="1024" height="1024" decoding="async" draggable="false"></figure>` });
  (p.parrafos || []).forEach((x, i) => { parrafo(x); ilus.filter((il) => il.despues === i).forEach(figura); });
  if (p.ruta) {
    const r = p.ruta; const li = (a) => (a || []).map((x) => `<li>${conNegrita(x)} ${botonVoz(x)}</li>`).join('');
    B.push({ tipo: 'html', html: `<section class="ruta-libro"><h3>${t('rutaLectora')} ${p.rutaCreada ? `<span class="chip rev">${t('nueva')}</span>` : ''}</h3>
      <h4>${t('palabras')}</h4><ul>${(r.palabras || []).map((w) => `<li><b>${esc(w.palabra)}</b>: ${esc(w.significado)} ${botonVoz(`${w.palabra}: ${w.significado}`)}</li>`).join('')}</ul></section>` });
    if (r.literal?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>${t('literal')}</h4><ul>${li(r.literal)}</ul></section>` });
    if (r.inferencial?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>${t('inferencial')}</h4><ul>${li(r.inferencial)}</ul></section>` });
    if (r.critico?.length) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>${t('critico')}</h4><ul>${li(r.critico)}</ul></section>` });
    if (r.reto) B.push({ tipo: 'html', html: `<section class="ruta-libro cont"><h4>${t('reto')}</h4><p>${conNegrita(r.reto)} ${botonVoz(r.reto)}</p></section>` });
  }
  return { bloques: B, habla };
}
function cabezaPagina(item, p, figura = '', ancha = false) {
  const u = item.unidadInfo;
  const kicker = item.tipo === 'cuento' ? t('cuento') : item.tipo === 'lectura' ? t('lectura') : '';
  const narrable = item.tipo === 'cuento' || item.tipo === 'lectura' || item.tipo === 'texto';
  return `<header class="hoja-cabeza${figura ? (ancha ? ' con-ilus lado' : ' con-ilus') : ''}"><div class="cab-texto">
    <div class="kicker">${esc([etiquetaUnidad(u), kicker].filter(Boolean).join(' · '))}</div>
    <h2 class="page-title">${conNegrita(p.titulo || item.titulo)}</h2>
    ${enIngles() && narrable && p.idiomaActivo !== 'en' ? `<p class="hint centro">${t('noIngles')}</p>` : ''}
    ${p.idiomaActivo === 'en' && p.estadoEn ? `<p class="hint centro"><span class="chip rev">${t('enRevisionEn')}</span></p>` : ''}
    ${narrable && voz.disponible ? `<div class="row centro"><button class="btn navy small" type="button" data-narrar data-etq="${t(item.tipo === 'texto' ? 'escucharPagina' : 'escucharCuento')}">${t(item.tipo === 'texto' ? 'escucharPagina' : 'escucharCuento')}</button></div>` : ''}
  </div>${figura}</header>`;
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
  if (!$('.stage') || vista.escenarioIdioma !== L()) montarEscenario();
  let p = null;
  if (['cuento', 'lectura', 'texto'].includes(item.tipo)) {
    try { p = localizar(await traerPagina(id)); } catch { $('.stage').innerHTML = `<div class="leaf"><div class="leaf-in"><div class="empty">${esc(t('noPagina'))}</div></div></div>`; return; }
  }
  const { bloques, habla } = bloquesDe(item, p || {});
  let hojas;
  if (bloques[0]?.tipo === 'especial') { hojas = [htmlEspecial(item)]; vista.letraHoja = yo.letra; }
  else {
    const med = medidas();
    hojas = paginar(bloques, med);
    const n = hojas.length;
    // Si la ilustración cabe junto al título, ningún ajuste estético puede separarlos.
    const conFig = (h) => h[0]?.includes('class="ilus"');
    const fig0 = conFig(hojas);
    const igual = (prueba) => prueba.length === n && conFig(prueba) === fig0;
    // Estética, como en el libro impreso: cada cuento toma el tamaño de letra más grande con el que
    // sigue cabiendo en el mismo número de hojas, y luego el texto se reparte parejo entre ellas.
    let letra = yo.letra; let lo = yo.letra; let hi = yo.letra * 1.22;
    for (let i = 0; i < 5; i++) {
      const mid = (lo + hi) / 2; const prueba = paginar(bloques, { ...med, letra: mid });
      if (igual(prueba)) { letra = mid; hojas = prueba; lo = mid; } else hi = mid;
    }
    if (n > 1) {
      let a = Math.round(med.alto * 0.6); let b = med.alto;
      for (let i = 0; i < 5 && b - a > 12; i++) {
        const mid = Math.round((a + b) / 2); const prueba = paginar(bloques, { ...med, alto: mid, letra });
        if (igual(prueba)) { hojas = prueba; b = mid; } else a = mid;
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
    if (p.voz?.intro) fragmentar(p.voz.intro).slice(0, 2).forEach((t) => bajarClip(t, vozDe('guardian', p.idiomaActivo)).catch(() => {}));
    bajarClip((p.titulo || item.titulo).replace(/[.!?]*$/, '.'), vozDe('narradora', p.idiomaActivo)).catch(() => {});
  }
  // Adelanta la página siguiente para que pasar sea instantáneo.
  const sig = secuencia[pos + 1]; if (sig && ['cuento', 'lectura', 'texto'].includes(sig.tipo)) traerPagina(sig.id).catch(() => {});
}
function montarEscenario() {
  $('#app').innerHTML = `
    <div class="libro">
      <button class="flecha izq" type="button" data-ir="-1" aria-label="${esc(t('pagAnterior'))}" title="${esc(t('pagAnterior'))}">‹</button>
      <div class="stage" aria-live="polite"></div>
      <button class="flecha der" type="button" data-ir="1" aria-label="${esc(t('pagSiguiente'))}" title="${esc(t('pagSiguiente'))}">›</button>
    </div>
    <div class="barra">
      <button class="btn ghost small" type="button" data-ir="-1">${t('anterior')}</button>
      <div class="donde" id="donde"></div>
      <button class="btn small" type="button" data-ir="1">${t('siguiente')}</button>
    </div>
    <div class="herramientas">
      <button class="btn ghost small" type="button" id="letraMenos" aria-label="${esc(t('letraMenos'))}" title="${esc(t('letraMenos'))}">A−</button>
      <button class="btn ghost small" type="button" id="letraMas" aria-label="${esc(t('letraMas'))}" title="${esc(t('letraMas'))}">A+</button>
      <button class="btn ghost small" type="button" id="idioma" aria-label="${esc(t('cambiarIdiomaAria'))}" lang="${enIngles() ? 'es' : 'en'}">${t('cambiarIdioma')}</button>
      <button class="btn ghost small" type="button" id="ilustrado" aria-pressed="${yo.ilustrado}">${yo.ilustrado ? t('conImagenes') : t('soloTexto')}</button>
      <button class="btn ghost small" type="button" id="ajusteVoz">${yo.vozLenta ? t('vozLenta') : t('vozNormal')}</button>
      <a class="btn ghost small" href="#indice">${t('indiceBtn')}</a>
    </div>
    <p class="legal">${esc(t('legalLibro'))}</p>`;
  vista.escenarioIdioma = L();
  const app = $('#app');
  app.onclick = (e) => {
    const ir = e.target.closest('[data-ir]'); if (ir) { pasar(+ir.dataset.ir); return; }
    const n = e.target.closest('[data-narrar]'); if (n) { if (voz.activa) callar(); else narrarPagina(); return; }
    const a = e.target.closest('[data-aprende]'); if (a) { abrirAprende(a.dataset.aprende); return; }
    if (e.target.id === 'letraMas' || e.target.id === 'letraMenos') { yo.letra = Math.max(1, Math.min(1.7, yo.letra + (e.target.id === 'letraMas' ? 0.1 : -0.1))); guardar(); mostrarPagina(vista.pagina.id, vista.hoja, 0, true); return; }
    if (e.target.id === 'idioma') { cambiarIdioma(enIngles() ? 'es' : 'en'); return; }
    if (e.target.id === 'ilustrado') { yo.ilustrado = !yo.ilustrado; guardar(); e.target.textContent = yo.ilustrado ? t('conImagenes') : t('soloTexto'); e.target.setAttribute('aria-pressed', String(yo.ilustrado)); mostrarPagina(vista.pagina.id, 0, 0, true); return; }
    if (e.target.id === 'ajusteVoz') { yo.vozLenta = !yo.vozLenta; guardar(); e.target.textContent = yo.vozLenta ? t('vozLenta') : t('vozNormal'); decir(yo.vozLenta ? t('leerDespacio') : t('leerNormal'), L()); return; }
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
  const espanol = enIngles() && vista.pagina.datos && vista.pagina.datos.idiomaActivo !== 'en'; // cuento aún sin inglés
  const tituloVisto = vista.pagina.datos?.titulo || tituloItem(item);
  const folio = item.tipo === 'portada' ? '' : `<div class="folio"${espanol ? ' lang="es"' : ''}>${esc(tituloVisto).slice(0, 48)} · ${vista.hoja + 1}/${vista.hojas.length}</div>`;
  leaf.innerHTML = `${decorHoja(temaDe(item), item.id + vista.hoja)}<div class="leaf-in${vista.hojas[vista.hoja] === '__aprende__' || /especial/.test(leaf.className) ? ' scroll' : ''}"${espanol && vista.hojas[vista.hoja] !== '__aprende__' ? ' lang="es"' : ''}>${html}</div>${folio}`;
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
  $('#donde').innerHTML = `<b${espanol ? ' lang="es"' : ''}>${esc(tituloVisto).slice(0, 60)}</b><small>${esc(etiquetaUnidad(u))}${u ? ' · ' : ''}${t('hojaDe', vista.hoja + 1, vista.hojas.length)} · ${rutaGrado?.ids.includes(item.id) ? esc(t('cuentoDeGrado', rutaGrado.ids.indexOf(item.id) + 1, rutaGrado.ids.length, gradoNom(rutaGrado.grado))) : t('paginaDe', vista.pagina.pos, secuencia.length - 1)}</small>`;
  $$('[data-ir="-1"]').forEach((b) => { b.disabled = vista.pagina.pos === 0 && vista.hoja === 0; });
  $$('[data-ir="1"]').forEach((b) => { b.disabled = vista.pagina.pos === secuencia.length - 1 && vista.hoja === vista.hojas.length - 1; });
  if (vista.hojas[vista.hoja] === '__aprende__' && !yo.leidos[item.id]) { yo.leidos[item.id] = true; guardar(); sumar(1, 'leido-' + item.id); }
  actualizarBotonesVoz();
  if (voz.activa && vista.resaltar != null) resaltar(vista.resaltar);
  if (item.tipo === 'unidad') traducirTitulos();
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
  if (rutaGrado) {
    const i = rutaGrado.ids.indexOf(vista.pagina.id);
    if (i >= 0) {
      if (d > 0 && i === rutaGrado.ids.length - 1) { location.hash = 'grado/' + rutaGrado.grado; return; }
      if (i + d >= 0 && i + d < rutaGrado.ids.length) { await mostrarPagina(rutaGrado.ids[i + d], d > 0 ? 0 : -1, d); verLibro(); return; }
    }
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
    a.src = audio; a.play().catch(() => aviso(t('noGrabacion')));
    return;
  }
  const frases = [];
  const lg = datos?.idiomaActivo === 'en' ? 'en' : 'es';
  if (datos?.voz?.intro) fragmentar(datos.voz.intro).forEach((t, n, a) => frases.push({ texto: t, guardian: true, quien: vozDe('guardian', lg), alNino: true, pausa: n === a.length - 1 ? Math.round(900 * ritmo()) : undefined }));
  frases.push({ texto: (datos?.titulo || item.titulo).replace(/[.!?]*$/, '.'), quien: vozDe('narradora', lg), pausa: Math.round(1200 * ritmo()) });
  // Empieza en la hoja visible.
  const enHoja = (k) => vista.hojas.findIndex((h) => h !== '__aprende__' && h.includes(`data-k="${k}"`));
  const primero = habla.find((f) => enHoja(f.k) >= vista.hoja) || habla[0];
  habla.filter((f) => f.k >= primero.k).forEach((f) => frases.push({ texto: f.texto, k: f.k, finParrafo: f.fin, quien: vozDe('narradora', lg) }));
  if (datos?.voz?.cierre) { frases[frases.length - 1].pausa = Math.round(1500 * ritmo()); fragmentar(datos.voz.cierre).forEach((t) => frases.push({ texto: t, guardian: true, quien: vozDe('guardian', lg), alNino: true })); }
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
      <div class="eyebrow-ink">${esc(t('colegio'))}</div>
      <h2 class="cover-title">${t('tituloHtml')}</h2>
      <p class="cover-sub">${esc(t('subPortada'))}</p>
      <p class="autores">Alexander Rojas Zamorano · Paula Andrea Rojas Cairasco · Daniela Rojas Cairasco</p>
      <div class="row centro" style="margin-top:18px">
        ${sigue ? `<a class="btn" href="#libro/${yo.pos.id}/${(yo.pos.hoja || 0) + 1}">${t('seguir')}</a><a class="btn ghost" href="#libro/${primero}/1">${t('desdeInicio')}</a>` : `<a class="btn" href="#libro/${primero}/1">${t('empezar')}</a>`}
        <a class="btn ghost" href="#indice">${t('navIndice')}</a>
      </div>
      <p class="pista-pasar">${esc(t('pistaPasar'))}</p>
      <p class="legal">${esc(t('legalPortada'))}</p>
    </div>`;
  }
  if (item.tipo === 'unidad') {
    const u = item.unidad; const T = tema(u.tema);
    const piezas = secuencia.filter((x) => x.unidad === u.clave && x.tipo !== 'unidad');
    const arte = [[18, 22], [82, 20], [12, 74], [88, 76], [50, 12]].map(([x, y], k) => motivo(T.m[k % T.m.length], T.c[k % T.c.length], x, y, 70 + (k % 2) * 24, (k * 17) % 40 - 20)).join('');
    return `<div class="cover unidad-cover"><div class="arte-unidad" aria-hidden="true">${arte}</div>
      <div class="kicker">${esc(etiquetaUnidad(u))}</div>
      <h2 class="cover-title unidad-titulo">${esc(nombreUnidad(u))}</h2>
      <ol class="toc">${piezas.map((x) => `<li><a href="#libro/${x.id}/1">${tituloCuento(x)}</a><span>${x.tipo === 'cuento' ? t('cuento') : t('lectura')}${yo.leidos[x.id] ? ' ✓' : ''}</span></li>`).join('')}</ol>
    </div>`;
  }
  const leidos = Object.keys(yo.leidos).length; const total = secuencia.filter((x) => x.tipo === 'cuento' || x.tipo === 'lectura').length;
  return `<div class="cover"><div class="kicker">${esc(t('finLibro'))}</div><h2 class="page-title">${esc(t('llegasteFinal'))}</h2>
    <p class="cover-sub">${esc(t('hasLeido', leidos, total))}</p>
    <div class="row centro" style="margin-top:16px"><a class="btn" href="#arbol">${esc(t('verMiArbol'))}</a><a class="btn ghost" href="#indice">${esc(t('navIndice'))}</a><a class="btn ghost" href="#libro/portada/1">${esc(t('volverPortada'))}</a></div></div>`;
}

/* ---------- Aprender con el cuento: guía según quién lee ---------- */
function htmlAprendeHoja() {
  const { datos: p, item } = vista.pagina; const g = p.guiaFamilia; const d = p.guiaDocente;
  const botones = [['jugar', '🎮', t('jugar'), t('jugarSub')], ['pensar', '💭', t('pensar'), t('pensarSub')], ['crecer', '💛', t('crecer'), t('crecerSub')], ['reinventar', '✏️', t('reinventar'), t('reinventarSub')]];
  // Las guías de familia y docente vienen del libro; si aún están en español se marcan así (y la voz las lee en español).
  const gEs = enIngles() && p.idiomaGuias !== 'en';
  const lgG = gEs ? 'es' : L();
  const marcaEs = gEs ? `<p class="hint">${esc(t('guiaEnEspanol'))}</p>` : '';
  let guia = '';
  if (yo.rol === 'familia' && g?.pasos?.length) {
    guia = `<div class="guia-rol"><h3>${esc(t('acompanar'))} ${botonVoz(tl(lgG, 'acompanar') + '. ' + g.pasos.map((x, i) => `${tl(lgG, 'paso', i + 1)} ${x}`).join(' '), t('escucharPasos'), lgG)}</h3>${marcaEs}
      <ol class="pasos"${gEs ? ' lang="es"' : ''}>${g.pasos.map((x) => `<li><span>${esc(x)}</span>${botonVoz(x, '🔊', lgG)}</li>`).join('')}</ol>
      <p class="hint">${esc(t('notaFamilia'))}</p></div>`;
  } else if (yo.rol === 'docente' && d) {
    const comp = (p.brujula?.competencias || []).map((id) => compDe(id)).filter(Boolean);
    guia = `<div class="guia-rol"><h3>${esc(t('guiaDocente'))} <span class="chip rev">${esc(t('enRevision'))}</span></h3>${marcaEs}
      <p><b>${esc(t('proposito'))}</b> ${enEs(esc(d.proposito))}</p>
      <p><b>${esc(t('actividad'))}</b> ${enEs(esc(d.actividad))}</p>
      <p><b>${esc(t('errorFrec'))}</b> ${enEs(esc(d.errorFrecuente))}</p>
      ${comp.length ? `<p><b>${esc(t('siembraEn', gradoNom(yo.grado)))}</b></p><ul class="seeds">${comp.map((k) => `<li><b>${esc(k.nombre)}.</b> ${esc(k.semillas[yo.grado] || '')}</li>`).join('')}</ul>` : ''}
      <p class="hint">${esc(t('dbaVerificar'))}</p></div>`;
  } else {
    const tip = yo.grado === 'Transición' ? t('tipTransicion') : t('tipOtros');
    guia = `<div class="guia-rol"><h3>${esc(t('aprendeJugando'))} ${botonVoz(tip, '🔊', L())}</h3><p>${esc(tip)}</p></div>`;
  }
  return `<div class="aprende-hoja"><div class="kicker">${esc(t('aprendeCuento'))}</div><h2 class="page-title"${p.idiomaActivo !== 'en' && enIngles() ? ' lang="es"' : ''}>${esc(p.titulo || item.titulo)}</h2>
    ${yo.rol !== 'estudiante' ? guia : ''}
    <div class="grid-aprende">${botones.map(([id, ic, n, s]) => `<button class="tarjeta-aprende${yo.hechas[`${id}-${item.id}`] ? ' hecha' : ''}" type="button" data-aprende="${id}"><span class="ic">${ic}</span><b>${n}</b><small>${s}</small></button>`).join('')}</div>
    ${yo.rol === 'estudiante' ? guia : ''}
    ${medios.videos?.[item.id] ? `<p><a class="btn ghost small" href="${esc(medios.videos[item.id])}" target="_blank" rel="noopener">${esc(t('videoclip'))}</a></p>` : ''}
  </div>`;
}
function abrirAprende(tab) {
  vista.aprende = { tab, q: 0, intento: 0, consigna: 0 };
  let m = $('.modal');
  if (!m) { m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true"><button class="cerrar" type="button">✕</button><div id="panel"></div></div>'; document.body.append(m); m.onclick = (e) => { if (e.target === m || e.target.closest('.cerrar')) cerrarAprende(); }; }
  const x = $('.cerrar', m); x.setAttribute('aria-label', t('cerrar')); x.title = t('cerrar');
  m.hidden = false; document.body.classList.add('con-modal');
  pintarAprende();
}
function cerrarAprende() { const m = $('.modal'); if (m) { m.hidden = true; document.body.classList.remove('con-modal'); callar(); if (vista.hojas[vista.hoja] === '__aprende__' && enLibro()) pintarHoja(0, true); } }
function pintarAprende() {
  const p = vista.pagina.datos; const tab = vista.aprende.tab;
  const tabs = [['jugar', '🎮 ' + t('jugar')], ['pensar', '💭 ' + t('pensar')], ['crecer', '💛 ' + t('crecer')], ['reinventar', '✏️ ' + t('reinventar')]];
  $('#panel').lang = L();
  $('#panel').innerHTML = `<div class="kicker">${esc(p.titulo)}</div><div class="tabs" role="tablist">${tabs.map(([v, n]) => `<button role="tab" type="button" data-tab="${v}" aria-selected="${tab === v}">${n}</button>`).join('')}</div><div id="tabcont"></div>`;
  $('#panel .tabs').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; callar(); Object.assign(vista.aprende, { tab: b.dataset.tab, q: 0, intento: 0 }); pintarAprende(); };
  ({ jugar: pJugar, pensar: pPensar, crecer: pCrecer, reinventar: pReinventar })[tab](p);
}

/* Jugar */
function orden(q) {
  let h = 0; for (const ch of q.id || q.pregunta) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return q.opciones.map((_, k) => k).sort((a, b) => ((a * 7 + h) % 5) - ((b * 7 + h) % 5) || a - b);
}
function pJugar(p) {
  const qs = (p.preguntas || []).filter((q) => q.tipo === 'opcion').map((q, i) => ({ ...q, id: q.id || `${p.id}-q${i + 1}` }));
  const A = vista.aprende; const box = $('#tabcont');
  if (!qs.length) { box.innerHTML = `<div class="empty">${esc(t('sinJuego'))}</div>`; return; }
  if (A.q >= qs.length) {
    const buenas = qs.filter((q) => yo.hechas[q.id]).length;
    sumar(1, `jugar-${p.id}`);
    box.innerHTML = `<div class="done-box"><b>${t('buenasDe', buenas, qs.length)}</b><p>${t('terminaste')}</p>
      <div class="row centro"><button class="btn" type="button" id="aPensar">${esc(t('irPensar'))}</button><button class="btn ghost" type="button" id="otraVez">${esc(t('otraVez'))}</button></div></div>`;
    $('#aPensar').onclick = () => { A.tab = 'pensar'; pintarAprende(); };
    $('#otraVez').onclick = () => { A.q = 0; A.intento = 0; pintarAprende(); };
    return;
  }
  const q = qs[A.q];
  const lg = idiomaPagina(); // las preguntas están en el idioma del cuento: la voz las lee en ese idioma (en pantalla, la interfaz va en el idioma elegido)
  box.innerHTML = `<div class="quiz">
    <div class="qprog" aria-hidden="true">${qs.map((_, k) => `<i class="${k < A.q ? 'done' : k === A.q ? 'now' : ''}"></i>`).join('')}</div>
    <div class="qlevel">${esc(t('preguntaDe', A.q + 1, qs.length))} · ${esc(nivelNom(q.nivel))}</div>
    <p class="qtext">${esc(q.pregunta)} ${botonVoz(q.pregunta + ' ' + q.opciones.map((o, i) => tl(lg, 'opcion', i + 1, o)).join(' '))}</p>
    <div class="opts">${orden(q).map((k) => `<div class="opt-fila"><button class="opt" type="button" data-k="${k}">${esc(q.opciones[k])}</button>${botonVoz(q.opciones[k])}</div>`).join('')}</div>
    <div id="fb" aria-live="polite"></div></div>`;
  if (yo.grado === 'Transición' && yo.rol !== 'docente') decir(q.pregunta, lg);
  $('.opts', box).onclick = (e) => {
    const b = e.target.closest('[data-k]'); if (!b || b.disabled) return;
    const k = +b.dataset.k;
    if (k === q.correcta) {
      b.classList.add('right'); $$('.opt', box).forEach((x) => { x.disabled = true; });
      sumar(A.intento === 0 ? 2 : 1, q.id);
      const expl = q.dondeLoDice ? t('asiLoDice', sinEmoji(q.dondeLoDice)) : (q.porque || '');
      const oir = (q.dondeLoDice ? tl(lg, 'asiLoDice', sinEmoji(q.dondeLoDice)) : (q.porque || ''));
      $('#fb').innerHTML = `<div class="fb ok"><b>${esc(t('muyBien'))}</b> ${esc(expl)} ${botonVoz(tl(lg, 'muyBien') + ' ' + oir, '🔊', lg)}
        <div class="row" style="margin-top:10px"><button class="btn small" type="button" id="sig">${esc(t('siguiente').replace(/\s*→$/, ''))}</button></div></div>`;
      $('#sig').onclick = () => { A.q++; A.intento = 0; callar(); pintarAprende(); };
      $('#sig').focus();
    } else {
      A.intento++; b.classList.add('wrong'); b.disabled = true;
      const resto = (x) => `${tl(x, 'errorEnsena')} ${q.dondeLoDice ? tl(x, 'buscaParte') : tl(x, 'piensaPersonajes')}`;
      $('#fb').innerHTML = `<div class="fb err"><b>${esc(t('casi'))}</b> ${esc(resto(L()))} ${botonVoz(tl(lg, 'casi') + ' ' + resto(lg), '🔊', lg)}</div>`;
    }
  };
}
/* Pensar */
function pPensar(p) {
  const qs = (p.preguntas || []).filter((q) => q.tipo === 'abierta').map((q, i) => ({ ...q, id: q.id || `${p.id}-a${i + 1}` }));
  const box = $('#tabcont');
  box.innerHTML = `<div class="open">
    ${qs.map((q) => `<div class="card" data-q="${q.id}">
      <div class="qlevel">${esc(nivelNom(q.nivel))}</div>
      <p class="q">${esc(q.pregunta)} ${botonVoz(q.pregunta + '. ' + tl(idiomaPagina(), 'pista') + ' ' + q.pista)}</p>
      <p class="hint">${esc(t('pista'))} ${esc(q.pista)}</p>
      <textarea aria-label="${esc(t('tuRespuesta'))}" placeholder="${esc(yo.grado === 'Transición' ? t('phTransicion') : t('phEscribe'))}">${esc(yo.respuestas[q.id] || '')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn small" type="button" data-guardar>${esc(t('guardarResp'))}</button>${guardian.modo ? `<button class="btn ghost small" type="button" data-guardian>${esc(t('comenteGuardian'))}</button>` : ''}</div>
      <div data-ai></div></div>`).join('')}
    ${guardian.modo ? `<div class="card"><h3>${esc(t('nuevasPreg'))}</h3><p class="hint">${esc(t('nuevasHint', gradoNom(yo.grado)))}</p><button class="btn navy small" type="button" id="nuevas">${esc(t('pedir4'))}</button><div id="nuevasOut"></div></div>` : ''}
  </div>`;
  box.onclick = async (e) => {
    const card = e.target.closest('[data-q]');
    if (e.target.matches('[data-guardar]') && card) {
      const id = card.dataset.q; const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso(t('unPocoMas')); return; }
      yo.respuestas[id] = txt; guardar(); if (!sumar(2, 'resp-' + id)) aviso(t('respGuardada'));
      sumar(0, `pensar-${p.id}`);
    }
    if (e.target.matches('[data-guardian]') && card) {
      const q = qs.find((x) => x.id === card.dataset.q); const txt = $('textarea', card).value.trim();
      if (txt.length < 3) { aviso(t('primeroEscribe')); return; }
      await comentar(e.target, $('[data-ai]', card), p, q.pregunta, txt);
    }
    if (e.target.id === 'nuevas') {
      const b = e.target; const out = $('#nuevasOut'); b.disabled = true; out.innerHTML = `<p class="hint">${esc(t('guardianPiensa'))}</p>`;
      try {
        const lista = await preguntarGuardian({ tarea: 'preguntas', p });
        const arr = Array.isArray(lista) ? lista.filter((x) => x && x.pregunta).slice(0, 6) : [];
        out.innerHTML = arr.length ? `<ol>${arr.map((x) => `<li style="margin-bottom:10px"><span class="qlevel">${esc(nivelNom(x.nivel || ''))}</span><br><b>${esc(x.pregunta)}</b> ${botonVoz(x.pregunta)}${x.pista ? `<br><span class="hint">${esc(t('pista'))} ${esc(x.pista)}</span>` : ''}</li>`).join('')}</ol>` : `<p class="hint">${esc(t('noLlegaron'))}</p>`;
      } catch (err) { out.innerHTML = `<p class="hint">${esc(mensajeError(err))}</p>`; }
      b.disabled = false;
    }
  };
}
async function comentar(btn, box, p, consigna, respuesta) {
  btn.disabled = true;
  box.innerHTML = `<div class="ai"><span class="ai-label">${esc(t('elGuardian'))}</span><span data-t>${esc(t('leyendoTuyo'))}</span></div>`;
  const tEl = $('[data-t]', box);
  try {
    const txt = await preguntarGuardian({ tarea: 'comentario', p, consigna, respuesta }, (parcial) => { tEl.textContent = parcial; });
    tEl.textContent = txt; box.insertAdjacentHTML('beforeend', botonVoz(txt, t('escucharGuardian')));
  } catch (err) { tEl.textContent = mensajeError(err); }
  btn.disabled = false;
}
/* Crecer */
function pCrecer(p) {
  const b = p.brujula; const box = $('#tabcont');
  if (!b) { box.innerHTML = `<div class="empty">${esc(t('pronto'))}</div>`; return; }
  const hecho = (k) => !!yo.hechas[`crecer-${k}-${p.id}`];
  const accion = (k, txt) => `<button class="btn small ${hecho(k) ? 'ghost' : ''}" type="button" data-hecho="${k}" ${hecho(k) ? 'disabled' : ''}>${hecho(k) ? esc(t('practicado')) : esc(txt)}</button>`;
  const comp = (b.competencias || []).map((id) => compDe(id)).filter(Boolean);
  box.innerHTML = `<div class="grow">
    <div class="card g-emo"><div class="qlevel">${esc(t('miCorazon'))}</div><h3>${esc(b.emocion.nombre)} ${botonVoz(b.emocion.nombre + '. ' + b.emocion.estrategia)}</h3><p>${esc(b.emocion.estrategia)}</p>
      <label class="hint" for="sentir">${esc(t('cuandoSentido'))}</label>
      <textarea id="sentir" style="min-height:80px;margin-top:6px" placeholder="${esc(yo.grado === 'Transición' ? t('phSentirT') : t('phSentir'))}">${esc(yo.respuestas['sentir-' + p.id] || '')}</textarea>
      <div class="row" style="margin-top:10px">${accion('emocion', t('guardarEmocion'))}</div></div>
    <div class="card g-val"><div class="qlevel">${esc(t('valorProp'))}</div><h3>${esc(b.valor.nombre)} ${botonVoz(b.valor.nombre + '. ' + b.valor.proposito)}</h3><p>${esc(b.valor.proposito)}</p><div class="row">${accion('valor', t('practiqueSemana'))}</div></div>
    <div class="card g-dis"><div class="qlevel">${esc(t('disciplina'))}</div><p>${esc(b.disciplina)} ${botonVoz(b.disciplina)}</p><div class="row">${accion('disciplina', t('cumpliHabito'))}</div></div>
    <div class="card g-inn"><div class="qlevel">${esc(t('imaginarCrear'))}</div><p>${esc(b.innovar)} ${botonVoz(b.innovar)}</p><p class="hint" style="margin:0">${esc(t('dibujalo'))}</p></div>
    <div class="card g-con"><div class="qlevel">${esc(t('conectaCon', b.conecta.area))}</div><p style="margin:0">${esc(b.conecta.actividad)} ${botonVoz(b.conecta.actividad)}</p></div>
    ${comp.length ? `<div class="card"><h3>${esc(t('siembraCuento', gradoNom(yo.grado)))}</h3><ul class="seeds">${comp.map((k) => `<li><b>${esc(k.nombre)}.</b> ${esc(k.semillas[yo.grado] || '')}</li>`).join('')}</ul></div>` : ''}
  </div>`;
  box.onclick = (e) => {
    const k = e.target.dataset?.hecho; if (!k) return;
    if (k === 'emocion') { const txt = $('#sentir').value.trim(); if (txt.length < 3) { aviso(t('cuentanos')); return; } yo.respuestas['sentir-' + p.id] = txt; guardar(); }
    sumar(2, `crecer-${k}-${p.id}`); yo.hechas[`crecer-${p.id}`] = true; guardar(); pCrecer(p);
  };
}
/* Reinventar */
function pReinventar(p) {
  const A = vista.aprende; const box = $('#tabcont');
  const retos = p.reinventar?.length ? p.reinventar : [tl(idiomaPagina(), 'otroFinal')];
  const mias = yo.versiones.filter((v) => v.cuentoId === p.id);
  const consigna = retos[A.consigna] || retos[0];
  box.innerHTML = `<div class="open">
    <div class="card"><h3>${esc(t('eligeReto'))}</h3>
      <div class="prompts">${retos.map((x, k) => `<div class="opt-fila"><button class="prompt" type="button" data-k="${k}" aria-pressed="${k === A.consigna}">${esc(x)}</button>${botonVoz(x)}</div>`).join('')}</div>
      <label for="nuevo" class="hint">${esc(t('escribeVersion'))}</label>
      <textarea id="nuevo" style="min-height:180px;margin-top:6px" placeholder="${esc(t('habiaUnaVez'))}"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" type="button" id="guardarV">${esc(t('guardarCuento'))}</button>${guardian.modo ? `<button class="btn ghost" type="button" id="comentarV">${esc(t('guardianLea'))}</button>` : ''}</div>
      <div id="aiV"></div></div>
    <div class="card"><h3>${esc(t('misReinventados'))}</h3>
      ${mias.length ? `<div class="versions">${mias.map((v, i) => `<div class="version"><small>${esc(v.fecha)} · ${esc(v.consigna)}</small><p>${esc(v.texto)}</p>
        <div class="row"><a class="btn small" target="_blank" rel="noopener" href="${waLink(p, v)}">${esc(t('enviarWa'))}</a></div></div>`).join('')}</div>
        <p class="wa" style="margin-top:10px">${esc(t('siNoWa', WHATSAPP_VISIBLE))}</p>`
        : `<p class="hint" style="margin:0">${esc(t('ningunoAun'))}</p>`}
    </div></div>`;
  box.onclick = (e) => {
    const b = e.target.closest('.prompt'); if (b) { const txt = $('#nuevo').value; A.consigna = +b.dataset.k; pReinventar(p); $('#nuevo').value = txt; return; }
    if (e.target.id === 'guardarV') {
      const texto = $('#nuevo').value.trim(); if (texto.length < 20) { aviso(t('masCuento')); return; }
      yo.versiones.push({ cuentoId: p.id, titulo: p.titulo, consigna, texto, fecha: new Date().toLocaleString(t('locale'), { dateStyle: 'medium', timeStyle: 'short' }) });
      guardar(); sumar(3); yo.hechas[`reinventar-${p.id}`] = true; guardar(); pReinventar(p);
    }
    if (e.target.id === 'comentarV') { const txt = $('#nuevo').value.trim(); if (txt.length < 20) { aviso(t('escribeCuento')); return; } comentar(e.target, $('#aiV'), p, consigna, txt); }
  };
}
// El cuento reinventado es del niño: se comparte su texto, no el del libro.
function textoCompartir(p, v) { return t('compartir', p.titulo, v); }
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
    const { prompt, json } = construirPrompt({ tarea, cuento: { titulo: p.titulo, texto: (p.parrafos || []).map((x) => x.replace(/\*\*/g, '')) }, grado, consigna, respuesta, idioma: p.idiomaActivo === 'en' ? 'en' : 'es' });
    if (json) return guardian.sample.json(prompt, { modelTier: 'quick', cache: false });
    const r = await guardian.sample(prompt, { modelTier: 'quick', cache: false, onText: ({ text }) => onText?.(text) });
    return r.text;
  }
  if (guardian.modo === 'web') {
    const r = await fetch('./api/guardian', { method: 'POST', headers: { 'content-type': 'application/json', 'x-jardin': 'lector' }, body: JSON.stringify({ tarea, cuentoId: p.id, grado, consigna, respuesta, idioma: p.idiomaActivo === 'en' ? 'en' : 'es' }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: j.code || 'upstream_error' };
    if (tarea === 'preguntas') return j.preguntas;
    onText?.(j.texto); return j.texto;
  }
  throw { code: 'not_granted' };
}
function mensajeError(e) {
  const c = e?.code;
  if (c === 'not_granted' || c === 'sampling_disabled') { guardian = { modo: null }; return t('errNoDisp'); }
  if (c === 'rate_limited') return t('errMuchos');
  if (c === 'refused') return t('errRefused');
  return t('errOtro');
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
  void U; rutaGrado = null;
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(t('indiceLibro'))}</h2><span class="chip">${esc(t('leidosDe', leidos, total))}</span></div>
    <p class="lead">${esc(t('indiceLead'))}</p>
    <div class="row" style="margin:14px 0"><a class="btn" href="#libro/portada/1">${esc(t('abrirLibro'))}</a><a class="btn ghost" href="#grado">${esc(t('soloGrado', gradoNom(yo.grado)))}</a>${yo.pos ? `<a class="btn ghost" href="#libro/${yo.pos.id}/${(yo.pos.hoja || 0) + 1}">${esc(t('seguirCorto'))}</a>` : ''}</div>
    ${intro.length ? `<div class="card" style="margin-bottom:14px"><h3>${esc(t('paraEmpezar'))}</h3><ul class="lista-indice">${intro.map((x) => `<li><a href="#libro/${x.id}/1">${tituloCuento(x)}</a></li>`).join('')}</ul></div>` : ''}
    <div class="unidades">${grupos.map((g) => { const T = tema(g.u.tema); return `<section class="card unidad-card" style="--ua:${T.a};--ub:${T.b}">
      <div class="unidad-arte" aria-hidden="true">${motivo(T.m[0], T.c[0], 86, 26, 56, -10)}${motivo(T.m[1], T.c[1], 70, 70, 40, 12)}</div>
      <div class="kicker" style="text-align:left">${esc(etiquetaUnidad(g.u))}</div><h3>${esc(nombreUnidad(g.u))}</h3>
      <ol class="lista-indice">${g.items.map((x) => `<li><a href="#libro/${x.id}/1">${tituloCuento(x)}</a>${yo.leidos[x.id] ? ' <span class="ok">✓</span>' : ''}</li>`).join('')}</ol></section>`; }).join('')}</div>
    <div class="chapter" style="margin-top:28px">
      <div class="card"><h3>${esc(t('dado'))}</h3><p class="hint">${esc(t('dadoHint'))}</p><div class="dice-out" id="dadoOut" aria-live="polite">${esc(t('dadoToca'))}</div><button class="btn" id="dado" type="button">${esc(t('lanzar'))}</button></div>
      <a class="compass-banner invest" href="#por-que-leer" style="margin:0"><span class="compass-ico" aria-hidden="true">📈</span><span><b>${esc(t('inversion'))}</b>${esc(t('inversionSub'))}</span></a>
    </div>
    <div class="section-title" id="mural"><h2>${esc(t('mural'))}</h2></div>
    ${mural.length ? `<div class="mural">${mural.map((m) => `<article><small>${esc(m.cuento || '')}</small><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p><small>${esc(m.firma || '')}</small></article>`).join('')}</div>`
      : `<div class="empty">${t('muralVacio', WHATSAPP_VISIBLE)}</div>`}`;
  $('#dado').onclick = () => {
    const d = dado(); const r = (a) => a[Math.floor(Math.random() * a.length)];
    const frase = t('dadoFrase', r(d.personajes), r(d.lugares), r(d.problemas));
    $('#dadoOut').innerHTML = `${esc(frase)} ${botonVoz(frase, '🔊', L())}`;
  };
  if (ancla === 'mural') $('#mural').scrollIntoView(); else window.scrollTo(0, 0);
  traducirTitulos();
}

/* ---------- Mi grado: solo los cuentos programados en la planeación ---------- */
function pintarGrado(pedido) {
  const plan = planGrados();
  const g = marco.grados.includes(pedido) ? pedido : yo.grado;
  const info = plan.grados[g] || { lecturas: [], recomendadas: [] };
  const titulo = (id) => { const x = secuencia.find((y) => y.id === id); return x ? tituloCuento(x) : esc(id); };
  const unicos = (lista) => [...new Set(lista.map((x) => x.id).filter((id) => posDe(id) >= 0))];
  const prog = unicos(info.lecturas || []);
  const reco = unicos(info.recomendadas || []).filter((id) => !prog.includes(id));
  // Ruta de lectura del grado: programados y recomendados, en el orden de las semanas.
  const primeraSemana = (id) => Math.min(...[...(info.lecturas || []), ...(info.recomendadas || [])].filter((x) => x.id === id).map((x) => x.semana));
  const ids = [...prog, ...reco].sort((a, b) => primeraSemana(a) - primeraSemana(b));
  const leidos = ids.filter((id) => yo.leidos[id]).length;
  const tarjeta = (id, filas, clase) => `<li class="card ${clase}"><div class="kicker" style="text-align:left">${esc(t('cuentoN', ids.indexOf(id) + 1, ids.length))}</div>
      <h3><a href="#libro/${id}/1" data-grado-ir="${id}">${titulo(id)}</a>${yo.leidos[id] ? ' <span class="ok">✓</span>' : ''}</h3>
      <ul class="semanas">${filas.map((x) => `<li><b>${esc(t('semana', x.semana))}</b> · ${esc(t('periodo', x.periodo))}${x.uso ? ` · ${esc(x.uso)}` : ''}${x.tema ? ` — ${esc(x.tema)}` : ''}</li>`).join('')}</ul></li>`;
  const porId = (lista, id) => (lista || []).filter((x) => x.id === id);
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(t('miGrado', gradoNom(g)))}</h2>${ids.length ? `<span class="chip">${esc(t('leidosDe', leidos, ids.length))}</span>` : ''}</div>
    <div class="row" role="tablist" aria-label="${esc(t('grado'))}" style="margin:10px 0 14px">${marco.grados.map((x) => `<a class="btn small ${x === g ? '' : 'ghost'}" role="tab" aria-selected="${x === g}" href="#grado/${encodeURIComponent(x)}">${esc(gradoNom(x))}</a>`).join('')}</div>
    <p class="lead">${esc(t('gradoLead', gradoNom(g)))}</p>
    ${ids.length ? `<div class="row" style="margin:12px 0"><a class="btn" href="#libro/${ids[0]}/1" data-grado-ir="${ids[0]}">${esc(t('empezarGrado', gradoNom(g)))}</a></div>` : ''}
    <h3 class="sub-grado">${esc(t('programados'))}</h3>
    ${prog.length ? `<ol class="lista-grado">${prog.map((id) => tarjeta(id, porId(info.lecturas, id), '')).join('')}</ol>`
      : `<div class="empty">${esc(t('sinPlan', gradoNom(g)))}</div>`}
    ${reco.length ? `<h3 class="sub-grado">${esc(t('recomendadas', gradoNom(g)))} <span class="chip rev">${esc(t('enRevision'))}</span></h3>
      <ol class="lista-grado">${reco.map((id) => tarjeta(id, porId(info.recomendadas, id), 'reco')).join('')}</ol>` : ''}
    <a class="compass-banner" href="#libro/portada/1" style="margin:20px 0"><span class="compass-ico" aria-hidden="true">📖</span><span><b>${esc(t('invitaLeer'))}</b>${esc(t('invitaSub'))}</span></a>
    <p class="hint">${esc(t('progLabel'))} ${esc(info.fuente || t('planInst'))}. ${esc(plan.nota || '')}${reco.length ? ' ' + esc(t('recoLabel')) + ' ' + esc(plan.notaRecomendadas || '') : ''}</p>`;
  if (g !== yo.grado) { yo.grado = g; guardar(); const sel = $('#grado'); if (sel) sel.value = g; }
  $('#app').onclick = (e) => { const a = e.target.closest('[data-grado-ir]'); if (a) rutaGrado = { grado: g, ids }; };
  window.scrollTo(0, 0);
  traducirTitulos();
}

/* ---------- Árbol ---------- */
/* ---------- El Mundo Mágico: mapa del libro (cada unidad es un lugar del camino) ---------- */
const ICONO_UNIDAD = { '1-2': '🌈', '3-4': '🌻', '5-6': '💬', '7-8': '🌱', '9-10': '🏡', '11-12': '📸', ce: '⭐', '13-14': '🤔', '15-16': '🤸', '17-18': '🚲', '19-20': '🏛️', '21-22': '🤝', '23-24': '👫', '25-26': '🧒', '27-28': '🐢', '29-30': '🏔️', '31-32': '🍲', '33-34': '🌙', '35-36': '🦕', '37-38': '🚀', '39-40': '🦋' };
const UNIDAD_EN = { '1-2': 'My feelings', '3-4': 'Things I like', '5-6': 'I say what I feel', '7-8': 'I grow and change', '9-10': 'I have a family', '11-12': 'My family stories', ce: 'Two little stars join the family', '13-14': 'Why do I feel this way?', '15-16': 'My body moves and shows how I feel', '17-18': 'A ride on wheels with my friends', '19-20': 'A museum visit with my family', '21-22': 'I have friends!', '23-24': 'I belong to groups', '25-26': 'Children have rights', '27-28': 'I protect animals in danger', '29-30': 'This is my country and my region', '31-32': 'Recipes made with magic and love', '33-34': 'Where does the sun go at night?', '35-36': 'Dinosaurs are so interesting!', '37-38': 'Space trips!', '39-40': 'Garden animals!' };
function pintarMundo() {
  fondoTema('jardin');
  const en = yo.idioma === 'en';
  const unidades = secuencia.filter((x) => x.tipo === 'unidad');
  const PASO = 132; const ALTO = 150 + unidades.length * PASO;
  const pos = unidades.map((u, i) => ({ x: i % 2 ? 72 : 28, y: 110 + i * PASO }));
  let d = `M 50 30 C 50 70, ${pos[0].x} 60, ${pos[0].x} ${pos[0].y}`;
  for (let i = 1; i < pos.length; i++) { const a = pos[i - 1]; const b = pos[i]; d += ` C ${a.x} ${a.y + PASO / 2}, ${b.x} ${b.y - PASO / 2}, ${b.x} ${b.y}`; }
  const deco = [];
  unidades.forEach((u, i) => {
    const tm = tema(u.unidad?.tema); const h = hashStr(u.id);
    const lado = i % 2 ? 14 : 86;
    deco.push(motivo(tm.m[h % tm.m.length], tm.c[h % tm.c.length], lado + ((h >> 3) % 9) - 4, ((pos[i].y + 18) / ALTO) * 100, 46 + (h % 22), (h % 50) - 25));
  });
  const paradas = unidades.map((u, i) => {
    const clave = u.unidad?.clave; const tm = tema(u.unidad?.tema);
    const ids = secuencia.filter((x) => x.unidad === clave && (x.tipo === 'cuento' || x.tipo === 'lectura')).map((x) => x.id);
    const leidos = ids.filter((id) => yo.leidos[id]).length;
    const nombre = en ? (UNIDAD_EN[clave] || u.unidad?.titulo || etiquetaUnidad(u.unidad)) : (u.unidad?.titulo || (clave === '1-2' ? t('misEmociones') : etiquetaUnidad(u.unidad)));
    const estado = leidos && leidos === ids.length ? '🌟' : '';
    return `<a class="parada" href="#libro/${u.id}/1" style="left:${pos[i].x}%;top:${pos[i].y}px;--c:${tm.c[0]}" aria-label="${esc(`${i + 1}. ${nombre}. ${t('buenasDe', leidos, ids.length)} ${t('cuentosLeidos')}`)}">
      <span class="globo"><span class="num">${i + 1}</span><span class="ico" aria-hidden="true">${ICONO_UNIDAD[clave] || '📖'}</span>${estado ? `<span class="hecho" aria-hidden="true">${estado}</span>` : ''}</span>
      <span class="nombre">${esc(nombre)}</span><span class="avance">${leidos}/${ids.length}</span></a>`;
  }).join('');
  $('#app').innerHTML = `<section class="mundo">
    <header class="mundo-cabeza"><h2>${esc(t('mundoTitulo'))}</h2>
      <p class="lead">${esc(t('mundoLead'))}</p></header>
    <div class="mapa" style="height:${ALTO}px">
      <svg class="sendero" viewBox="0 0 100 ${ALTO}" preserveAspectRatio="none" aria-hidden="true">
        <path d="${d}" class="sendero-borde"/><path d="${d}" class="sendero-camino"/></svg>
      ${deco.join('')}${paradas}
      <div class="meta" style="top:${ALTO - 40}px">${esc(t('finCamino'))}</div>
    </div></section>`;
}

/* ---------- Revisión de ilustraciones (solo con la clave de revisión) ----------
   jardin.sabicentec.com/#revisar · Los niños solo ven las ilustraciones aprobadas. */
const CLAVE_REV = 'jardin-revision';
function claveRev() { try { return localStorage.getItem(CLAVE_REV) || ''; } catch { return ''; } }
async function apiRev(ruta, metodo = 'GET') {
  const r = await fetch('./api/ilustracion/' + ruta, { method: metodo, headers: { 'x-revision': claveRev() } });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.code || ('HTTP ' + r.status)); }
  return r;
}
async function pintarRevision() {
  fondoTema('jardin');
  const app = $('#app');
  if (!claveRev()) {
    app.innerHTML = `<section class="card revision"><h2>Revisión de ilustraciones</h2>
      <p class="hint">Solo para el equipo de CENTEC. Escriba la clave de revisión.</p>
      <form id="fRev" class="row"><input id="claveRev" type="password" autocomplete="off" aria-label="Clave de revisión" style="flex:1;min-width:220px">
      <button class="btn small" type="submit">Entrar</button></form></section>`;
    $('#fRev').onsubmit = (e) => { e.preventDefault(); try { localStorage.setItem(CLAVE_REV, $('#claveRev').value.trim()); } catch { /* nada */ } pintarRevision(); };
    return;
  }
  app.innerHTML = '<section class="card revision"><h2>Revisión de ilustraciones</h2><p class="hint">Cargando…</p></section>';
  let datos;
  try { datos = await (await apiRev('lista')).json(); }
  catch (e) {
    app.innerHTML = `<section class="card revision"><h2>Revisión de ilustraciones</h2><p>La clave no es válida o el servicio no responde (${esc(e.message)}).</p><button class="btn small" type="button" id="otraClave">Escribir otra clave</button></section>`;
    $('#otraClave').onclick = () => { try { localStorage.removeItem(CLAVE_REV); } catch { /* nada */ } pintarRevision(); };
    return;
  }
  const chip = (e) => `<span class="chip ${e === 'aprobada' ? 'ok' : e === 'pendiente' ? 'rev' : ''}">${esc(e)}</span>`;
  app.innerHTML = `<section class="card revision"><h2>Revisión de ilustraciones</h2>
    <p class="hint">Compare cada imagen con lo que dice el cuento. <b>Aprobar</b> la muestra a los niños; <b>Rechazar</b> la oculta; <b>Generar otra</b> crea una nueva versión (tarda unos segundos).</p>
    <p class="row"><button class="btn small" type="button" id="generarFaltan">✨ Generar todas las que faltan</button> <span class="hint" id="progresoRev"></span></p>
    ${datos.paginas.map((pg) => `<article class="rev-cuento"><h3>${esc(pg.titulo)}${pg.tituloEn ? ` · <i>${esc(pg.tituloEn)}</i>` : ''}</h3>
      <div class="rev-grid">${pg.ilustraciones.map((il) => `<div class="rev-slot" data-p="${esc(pg.id)}" data-n="${il.n}">
        <div class="rev-img">${il.estado === 'sin generar' ? '<span class="hint">Sin imagen todavía</span>' : '<span class="hint">Cargando imagen…</span>'}</div>
        <p><b>${il.n}.</b> ${esc(il.alt?.es || '')}</p><p class="estado">${chip(il.estado)}</p>
        <div class="row"><button class="btn small" type="button" data-acc="generar">${il.estado === 'sin generar' ? 'Generar' : 'Generar otra'}</button>
        <button class="btn small navy" type="button" data-acc="aprobar" ${il.estado === 'sin generar' ? 'disabled' : ''}>Aprobar</button>
        <button class="btn small ghost" type="button" data-acc="rechazar" ${il.estado === 'sin generar' ? 'disabled' : ''}>Rechazar</button></div></div>`).join('')}</div></article>`).join('')}
    <p class="row"><button class="btn ghost small" type="button" id="salirRev">Cerrar la revisión en este equipo</button></p></section>`;
  const verImagen = async (slot) => {
    const caja = $('.rev-img', slot);
    try { const b = await (await apiRev(`${slot.dataset.p}/${slot.dataset.n}?t=${Date.now()}`)).blob(); caja.innerHTML = `<img alt="" src="${URL.createObjectURL(b)}">`; }
    catch { caja.innerHTML = '<span class="hint">Sin imagen todavía</span>'; }
  };
  $$('.rev-slot', app).forEach((slot) => { if (!$('.rev-img', slot).textContent.includes('Sin imagen')) verImagen(slot); });
  app.onclick = async (e) => {
    if (e.target.id === 'generarFaltan') {
      const faltan = $$('.rev-slot', app).filter((sl) => $('.estado', sl).textContent.trim() === 'sin generar');
      e.target.disabled = true;
      for (const [k, sl] of faltan.entries()) {
        $('#progresoRev').textContent = `Dibujando ${k + 1} de ${faltan.length}…`;
        $('.rev-img', sl).innerHTML = '<span class="hint">Dibujando…</span>';
        try { const j = await (await apiRev(`${sl.dataset.p}/${sl.dataset.n}/generar`, 'POST')).json(); $('.estado', sl).innerHTML = chip(j.estado); await verImagen(sl); $$('button', sl).forEach((x) => { x.disabled = false; }); $('[data-acc="generar"]', sl).textContent = 'Generar otra'; }
        catch (err) { $('.rev-img', sl).innerHTML = `<span class="hint">No se pudo (${esc(err.message)})</span>`; }
      }
      $('#progresoRev').textContent = faltan.length ? 'Listo. Ahora revise y apruebe.' : 'No falta ninguna.';
      e.target.disabled = false; cachePaginas.clear(); return;
    }
    if (e.target.id === 'salirRev') { try { localStorage.removeItem(CLAVE_REV); } catch { /* nada */ } location.hash = 'indice'; return; }
    const b = e.target.closest('[data-acc]'); if (!b) return;
    const slot = b.closest('.rev-slot'); const acc = b.dataset.acc;
    $$('button', slot).forEach((x) => { x.disabled = true; });
    if (acc === 'generar') $('.rev-img', slot).innerHTML = '<span class="hint">Dibujando… (10 a 30 segundos)</span>';
    try {
      const j = await (await apiRev(`${slot.dataset.p}/${slot.dataset.n}/${acc}`, 'POST')).json();
      $('.estado', slot).innerHTML = chip(j.estado);
      if (acc === 'generar') await verImagen(slot);
      cachePaginas.clear();
    } catch (err) { aviso('No se pudo: ' + err.message); }
    $$('button', slot).forEach((x) => { x.disabled = false; });
    $('[data-acc="generar"]', slot).textContent = 'Generar otra';
  };
}

function pintarArbol() {
  const e = etapa(yo.semillas); const leidos = Object.keys(yo.leidos).length; const total = secuencia.filter((x) => x.tipo === 'cuento' || x.tipo === 'lectura').length;
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(t('miArbol'))}</h2></div>
    <div class="card tree-panel">${arbolSVG(e.i)}<div>
      <p style="font-size:1.2rem;margin:0"><b>${esc(t('nSemillas', yo.semillas))}</b> · ${t('tuArbolEs', esc(e.nombre))}</p>
      <p class="hint">${esc(e.sig ? t('faltan', e.sig.min - yo.semillas, e.sig.nombre) : t('cima'))}</p>
      <div class="stages">${ETAPAS.map((x, k) => `<span class="${k <= e.i ? 'on' : ''}">${esc(nombreEtapa(k))}</span>`).join('')}</div></div></div>
    <div class="section-title"><h2>${esc(t('comoSemillas'))}</h2></div>
    <div class="card"><ul>${t('reglas').map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <p class="hint" style="margin-top:10px">${esc(t('llevas', leidos, total, yo.versiones.length))}</p></div>`;
  window.scrollTo(0, 0);
}

/* ---------- Competencias ---------- */
function pintarCompetencias() {
  const M = competencias(); const g = yo.grado;
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(M.titulo)}</h2><span class="chip rev">${esc(t('enRevisionMay'))}</span></div>
    <p class="lead">${esc(t('compLead'))} ${esc(M.nota)}</p>
    <p class="hint" style="margin:14px 0 4px">${t('mostrandoSemillas', esc(gradoNom(g)))}</p>
    ${M.familias.map((f) => `<div class="section-title"><h2 style="font-size:1.3rem">${f.icono} ${esc(f.nombre)}</h2></div>
      <div class="comp-grid">${M.lista.filter((k) => k.familia === f.id).map((k) => `<article class="card comp">
        <h3>${esc(k.nombre)}</h3><p class="hint" style="margin:0 0 8px">${esc(t('metaExperto'))} ${esc(k.meta)}</p>
        <p class="seed"><span>${esc(t('semillaEn', gradoNom(g)))}</span>${esc(k.semillas[g])}</p>
        <p style="margin:8px 0 0;font-size:.92rem"><b>${esc(t('comoSiembra'))}</b> ${esc(k.comoLoSiembra)}</p></article>`).join('')}</div>`).join('')}`;
  window.scrollTo(0, 0);
}

/* ---------- Por qué leer ---------- */
function pintarPorQueLeer() {
  const P = porQueLeer(); const F = Object.fromEntries(P.fuentes.map((f, i) => [f.id, { ...f, n: i + 1 }]));
  const refs = (ids = []) => ids.map((id) => `<a class="ref" href="#fuente-${id}" data-ref="${id}">[${F[id].n}]</a>`).join('');
  $('#app').innerHTML = `
    <div class="section-title"><h2>${esc(P.titulo)}</h2></div>
    ${P.intro.map((p) => `<p class="lead">${esc(p)}</p>`).join('')}
    ${P.areas.map((a) => `<div class="section-title"><h2 style="font-size:1.3rem">${a.icono} ${esc(a.nombre)}</h2></div>
      <div class="comp-grid">${a.beneficios.map((x) => `<article class="card comp"><h3>${esc(x.titulo)}</h3>
        <p style="margin:0 0 8px">${esc(x.adulto)} ${refs(x.fuente)}</p>
        <p class="seed"><span>${esc(t('comoEmpieza'))}</span>${esc(x.nino)}</p>
        <p class="hint" style="margin:8px 0 0;font-size:.85rem">${esc(t('evidencia'))} ${esc(x.evidencia)}</p></article>`).join('')}</div>`).join('')}
    <div class="section-title"><h2 style="font-size:1.3rem">${esc(P.habito.titulo)}</h2></div>
    <div class="card"><ol class="plan">${P.habito.pasos.map((x) => `<li>${esc(x)} ${botonVoz(x, '🔊', L())}</li>`).join('')}</ol></div>
    <div class="section-title"><h2 style="font-size:1.1rem">${esc(t('fuentes'))}</h2></div>
    <ol class="fuentes">${P.fuentes.map((f) => `<li id="fuente-${f.id}" lang="en">${esc(f.cita)} ${f.doi ? `<a href="https://doi.org/${esc(f.doi)}" target="_blank" rel="noopener">doi:${esc(f.doi)}</a>` : `<span class="hint" lang="${L()}">(${esc(f.nota || t('doiVerificar'))})</span>`}</li>`).join('')}</ol>`;
  $('#app').onclick = (e) => { const r = e.target.closest('[data-ref]'); if (!r) return; e.preventDefault(); document.getElementById('fuente-' + r.dataset.ref)?.scrollIntoView({ behavior: 'smooth' }); };
  window.scrollTo(0, 0);
}

/* ---------- Protección: lectura en pantalla ---------- */
function proteger() {
  const libre = (t) => t?.closest?.('input,textarea,[contenteditable="true"]');
  ['copy', 'cut', 'dragstart', 'selectstart'].forEach((ev) => document.addEventListener(ev, (e) => { if (!libre(e.target)) { e.preventDefault(); if (ev === 'copy') aviso(t('soloPantalla')); } }));
  document.addEventListener('contextmenu', (e) => { if (!libre(e.target)) e.preventDefault(); });
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'p', 'a', 'u'].includes(k) && !libre(e.target)) { e.preventDefault(); aviso(t('soloPantalla')); }
  });
  window.addEventListener('beforeprint', () => aviso(t('noImprime')));
}

iniciar();
