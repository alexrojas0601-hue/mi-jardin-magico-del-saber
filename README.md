# Mi Jardín Mágico del Saber

Libro interactivo de cuentos del ecosistema SABI CENTEC (Colegio CENTEC Córdoba, Cali) para Transición, 1.°, 2.° y 3.°. Cada cuento tiene cinco momentos:

- **Leer**: texto con letra ajustable, lectura en voz alta y palabras mágicas.
- **Jugar**: preguntas de opción múltiple (literal, inferencial, palabras en contexto) que muestran la oración exacta del cuento.
- **Pensar**: preguntas críticas abiertas con pista; el Guardián de los Colores (Claude) comenta la respuesta y crea preguntas nuevas.
- **Reinventar**: retos para cambiar el cuento, Dado de la imaginación y envío a CENTEC por WhatsApp para el mural.
- **Videoclip**: espacio para las historietas animadas.

Las semillas del Árbol del Saber y los cuentos de cada niño se guardan solo en su dispositivo (Ley 1581 de 2012).

## Dónde está cada cosa
| Archivo | Para qué |
| --- | --- |
| `public/data/cuentos.json` | Texto del libro, preguntas, retos y guías. Es lo que actualizan los Dots. |
| `public/data/medios.json` | Enlaces de videoclips y cuentos del mural. |
| `public/index.html`, `public/js/app.js` | La aplicación. |
| `public/js/guardian.js` | Instrucciones del Guardián (las comparten la página y el Worker). |
| `src/worker.js` | Worker de Cloudflare: sirve el libro y `/api/guardian`. |
| `scripts/validar.mjs` | Revisión automática del libro: `node scripts/validar.mjs`. |
| `docs/AGENTES.md` | Cómo trabajan los Dots que actualizan el contenido. |

## Publicar
Cloudflare despliega desde GitHub (rama `main`). Para el Guardián en sabicentec.com hace falta el secreto `ANTHROPIC_API_KEY` en el Worker.

Reglas de trabajo: `CLAUDE.md` y `docs/PROMPT-MAESTRO-SABI.md`.
