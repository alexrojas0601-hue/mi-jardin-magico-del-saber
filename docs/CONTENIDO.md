# Dónde vive el libro y cómo se actualiza

**El texto del libro no está en GitHub.** «El Jardín Mágico del Saber» es una obra protegida (© 2025 Editorial Pluma de Oro S.A.S.) y este repositorio es público. Por eso:

| Qué | Dónde |
| --- | --- |
| Texto de los cuentos y lecturas, Ruta Lectora, preguntas, Crecer, guías, voz del Guardián | Base **D1 `jardin-magico-libro`** de Cloudflare (tabla `paginas`, una fila por cuento; tabla `meta` con las unidades). |
| Competencias, «Por qué leer», Dado de la imaginación | `public/data/marco.json` (en el repositorio). |
| Videoclips, voces grabadas, mural | `public/data/medios.json` (en el repositorio). |
| Copia de trabajo del libro armado | `contenido/libro.json` (carpeta ignorada por git; nunca se sube). |

## Cómo llega a la pantalla
El Worker entrega **una página a la vez** por `/api/libro/pagina/<id>`, codificada, y solo a la propia página del libro (encabezado `x-jardin` + mismo origen). En pantalla el texto no se puede seleccionar, copiar, descargar ni imprimir. Ninguna protección en pantalla es total (una foto siempre es posible), pero sí impide copiar y descargar el libro.

## Actualizar el contenido
1. Armar: `python3 scripts/armar_libro.py --fuente LIBRO.txt --lotes CARPETA_LOTES --capitulo MATERIAL.json` → `contenido/libro.json`.
2. Validar: `node scripts/validar.mjs` (revisa preguntas, citas, Ruta, Crecer, guías y voz).
3. Probar: `node scripts/servidor-local.mjs` y abrir http://localhost:8787 en computador y celular.
4. Subir: `python3 scripts/sql_libro.py` y `npx wrangler d1 execute jardin-magico-libro --remote --file contenido/libro.sql`.

Los Dots proponen cambios al material en un informe (`docs/informes/AAAA-MM.md`) con el id del cuento y el campo; una persona del equipo aplica y sube. Nunca se cambia el texto de un cuento sin aprobación de los autores.

## Voces grabadas
Si un docente graba un cuento, se sube el mp3 (por ejemplo a R2) y se pone en `medios.json` → `audios` con el id del cuento. Esa grabación tiene prioridad sobre la voz del navegador.
