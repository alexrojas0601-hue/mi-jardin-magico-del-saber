# Instrucciones para Claude en este repositorio

Aplicación: **El Jardín Mágico del Saber**, libro interactivo de cuentos (Transición a 3.°). Hace parte del ecosistema SABI CENTEC del Colegio CENTEC Córdoba (Comuna 15, Cali).

Estructura: **el texto del libro NO va en este repositorio público** (© Editorial Pluma de Oro S.A.S.): viaja cifrado en `src/libro.cifrado.txt` (llave solo en la base D1 `jardin-magico-libro`) y se entrega por `/api/libro` una página a la vez (ver `docs/CONTENIDO.md`). En el repositorio: `public/data/marco.json` (competencias, por qué leer, dado), `public/data/medios.json` (videoclips, voces grabadas, mural), la app `public/index.html` + `public/js/app.js` y el Worker `src/worker.js`. Antes de cualquier commit: `node scripts/validar.mjs`. Nunca subir `contenido/` ni pegar texto de los cuentos en archivos del repositorio, issues o pull requests. Los Dots siguen `docs/AGENTES.md` y trabajan por pull request, nunca directo a `main`.

## Regla principal
Toda tarea en este repositorio sigue `docs/PROMPT-MAESTRO-SABI.md`, la gobernanza común del ecosistema. Incluye los Dots investigadores, auditores y de mejora; los tutores por área; la instrucción maestra visual; los comandos didácticos (`/worksheet` `/escape` `/detective` `/boardgame` `/stations` `/manipulative` `/comic` `/lapbook` `/puzzle` `/minibook` y demás) y los comandos de pensamiento (`/ultrathink` `/stepback` `/firstprinciples` … `/selfcheck`).

Cuando se construya: Transición y primera infancia. Juego, exploración, lectura en voz alta con un adulto, sin fuego ni piezas pequeñas; nada de pantallas largas (sesiones cortas y acompañadas).

## No negociables
1. Que las personas verdaderamente aprendan: producir el recurso (no describirlo), interpretarlo, aplicarlo y comprobar la comprensión.
2. Currículo MEN (EBC y DBA con número y redacción oficial; si no se verifica, se dice) y áreas SABI (matemática y estadística financiera, inteligencia emocional, inglés, STEAM, SENA).
3. Evidencia revisada por pares con DOI verificado; nada de neuromitos; nunca inventar datos ni referencias.
4. Seguridad infantil y privacidad (Ley 1581 de 2012): nadie ve datos de otros; nada personal en archivos públicos.
5. Pedagogía del error: «El error no nos detiene: nos enseña, nos fortalece y nos hace crecer».
6. Identidad: azul #1A2D7A, naranja #F47C20, dorado #F5C518; español de Colombia claro, sin juicio.
7. Todo contenido nuevo queda «en revisión» hasta que lo apruebe el docente o el equipo responsable.

## Antes de publicar
- No romper lo que funciona: probar en navegador, en computador y en celular, sin errores de JavaScript.
- Aplicar `/factcheck` y `/selfcheck`, y que un Dot auditor distinto de quien creó el contenido lo revise.
- Commit en español que diga qué cambió; Cloudflare despliega desde GitHub. Verificar que el despliegue terminó.

## Propiedad y protección (no quitar)
- Titulares: **SABI CENTEC — Alexander Rojas Zamorano, Paula Andrea Rojas Cairasco y Daniela Rojas Cairasco**. Licencia propietaria en `LICENSE` (todos los derechos reservados, no es código abierto). Esto cubre el software de la app; el texto de los cuentos sigue siendo © Editorial Pluma de Oro S.A.S.
- Cada HTML servido (hoy `public/index.html`) lleva: comentario de derechos tras `<!doctype html>`, metas `author`/`copyright`/`rights`/`robots noai`/`og:site_name`, JSON-LD con `copyrightHolder` y `author` (los tres titulares y SABI CENTEC) y en el pie la línea «© 2025-2026 SABI CENTEC · … · Todos los derechos reservados · Prohibida su copia o reproducción». Toda página nueva debe llevarlos.
- `public/js/sabi-proteccion.js` se carga en el `<head>`: bloquea marcos ajenos, muestra «Copia no autorizada» si la app se aloja fuera de *.sabicentec.com (o workers.dev/pages.dev/localhost), protege imágenes y atajos. Es **disuasivo**: la protección real es el aviso legal, el registro ante la DNDA y el cifrado del libro. Convive con `proteger()` de `public/js/app.js` (lectura en pantalla).
- `public/robots.txt` bloquea bots de IA y copiadores; `public/_headers` agrega cabeceras que no rompen (nosniff, `X-Robots-Tag: noai`, `frame-ancestors`). Como el Worker usa `run_worker_first`, las cabeceras que de verdad aplican son las que pone `src/worker.js`.
