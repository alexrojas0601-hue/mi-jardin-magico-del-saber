# El Jardín Mágico del Saber

Libro interactivo de cuentos del ecosistema SABI CENTEC (Colegio CENTEC Córdoba, Cali) para Transición, 1.°, 2.° y 3.°. Al entrar se abre **el libro**, página por página: portada con contenido, presentación del capítulo y cada cuento completo con su Ruta Lectora (#libro/N). Además, cada cuento tiene sus actividades:

- **Leer**: texto con letra ajustable, lectura en voz alta y palabras mágicas.
- **Jugar**: preguntas de opción múltiple (literal, inferencial, palabras en contexto) que muestran la oración exacta del cuento.
- **Pensar**: preguntas críticas abiertas con pista; el Guardián de los Colores (Claude) comenta la respuesta y crea preguntas nuevas.
- **Reinventar**: retos para cambiar el cuento, Dado de la imaginación y envío a CENTEC por WhatsApp para el mural.
- **Videoclip**: espacio para las historietas animadas.

Las semillas del Árbol del Saber y los cuentos de cada niño se guardan solo en su dispositivo (Ley 1581 de 2012).

## Dónde está cada cosa
| Archivo | Para qué |
| --- | --- |
| `public/index.html`, `public/js/app.js` | El lector: hojas que se pasan como un libro, voz del Guardián, aprendizaje guiado por rol. |
| `public/data/marco.json` | Competencias, «Por qué leer», Dado de la imaginación. |
| `public/data/medios.json` | Videoclips, voces grabadas y mural. |
| `src/worker.js` | Worker: sirve la app, el libro protegido (`/api/libro`) y el Guardián (`/api/guardian`). |
| `scripts/armar_libro.py`, `scripts/sql_libro.py` | Arman el libro y lo preparan para la base D1. |
| `scripts/validar.mjs` | Revisión automática antes de publicar. |
| `docs/CONTENIDO.md` | **Dónde vive el texto del libro (D1, no GitHub) y cómo se actualiza.** |

## Publicar
Cloudflare despliega desde GitHub (rama `main`). Para el Guardián en sabicentec.com hace falta el secreto `ANTHROPIC_API_KEY` en el Worker.

Reglas de trabajo: `CLAUDE.md` y `docs/PROMPT-MAESTRO-SABI.md`.
