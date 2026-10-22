# Dónde vive el libro y cómo se actualiza

**El texto del libro no está legible en GitHub.** «El Jardín Mágico del Saber» es una obra protegida (© 2025 Editorial Pluma de Oro S.A.S.) y este repositorio es público. Por eso:

| Qué | Dónde |
| --- | --- |
| Texto de los cuentos y lecturas, Ruta Lectora, preguntas, Crecer, guías, voz del Guardián | `src/libro.cifrado.txt`: **cifrado con AES-256-GCM** (sobre gzip). Viaja dentro del Worker; en GitHub es ilegible. |
| Llave del libro | Base **D1 `jardin-magico-libro`** de Cloudflare, tabla `meta`, clave `clave_libro`. **Nunca va en el repositorio.** |
| Competencias, «Por qué leer», Dado de la imaginación | `public/data/marco.json`. |
| Videoclips, voces grabadas, mural | `public/data/medios.json`. |
| Copia de trabajo del libro armado | `contenido/libro.json` (carpeta ignorada por git; nunca se sube). |

## Cómo llega a la pantalla
Al arrancar, el Worker lee la llave en D1, descifra el libro en memoria y entrega **una página a la vez** por `/api/libro/pagina/<id>`, codificada, y solo a la propia página del libro (encabezado `x-jardin` + mismo origen; desde fuera responde 403). En pantalla el texto no se puede seleccionar, copiar, descargar ni imprimir. Ninguna protección en pantalla es total (una foto siempre es posible), pero sí impide copiar y descargar el libro.

## Actualizar el contenido
1. Armar: `python3 scripts/armar_libro.py --fuente LIBRO.txt --lotes CARPETA_LOTES --capitulo MATERIAL.json` → `contenido/libro.json`.
2. Validar: `node scripts/validar.mjs` (preguntas, citas, Ruta, Crecer, guías y voz).
3. Probar: `node scripts/servidor-local.mjs` (o `npx wrangler dev --local`) en computador y celular.
4. Cifrar con la llave de D1: `python3 scripts/cifrar_libro.py --clave LLAVE` → `src/libro.cifrado.txt`.
5. Commit y push a `main`: Cloudflare despliega solo.

Los Dots proponen cambios al material en un informe (`docs/informes/AAAA-MM.md`) con el id del cuento y el campo; una persona del equipo aplica, cifra y sube. Nunca se cambia el texto de un cuento sin aprobación de los autores.

## Voces grabadas
Si un docente graba un cuento, se sube el mp3 (por ejemplo a R2) y se pone en `medios.json` → `audios` con el id del cuento. Esa grabación tiene prioridad sobre la voz del navegador.
