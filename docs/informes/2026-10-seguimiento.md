# Informe de los Dots · octubre de 2026 · seguimiento del 27-10-2026

**Estado: en revisión.** Este informe no cambia el libro ni `marco.json`. Lo aprueba el equipo de Lenguaje de CENTEC.
Trabajo de: `Dot_Investigador_SextoSentido`, `Dot_Lectura_Comprension`, `Dot_Auditor_Riguroso` (subagente independiente) y `Dot_Mejora_Continua`.

> No copia texto de los cuentos (© Editorial Pluma de Oro S.A.S.) ni nombra personajes. No contiene datos personales.

## 0. Resultado en una línea

**Este mes no hay evidencia nueva que justifique más cambios.** La tarea mensual ya corrió el 23-10-2026 y dejó tres pull requests abiertos y sin revisar (#2, #3 y #4). En cuatro días no apareció investigación verificada que cambie esas propuestas. Por eso este pull request solo trae este informe y una línea en `docs/PENDIENTES.md` (regla 8 de la tarea).

## 1. Qué se investigó (Dot_Investigador_SextoSentido)

Se buscó investigación publicada después de los informes del 23-10-2026, en los temas de la tarea: lectura dialógica y compartida, funciones ejecutivas, conciencia fonológica en español, pantalla frente a papel y uso de IA con niños de 5 a 9 años. También se retomaron los pendientes que dejó el informe anterior: leer a mano Tang, Lau y Du (2026) y buscar evidencia en español.

Nota de método: en esta ejecución, `api.crossref.org` y `doi.org` no estaban disponibles desde el entorno. Por eso los DOI se comprobaron en la página de la revista o del repositorio cuando abrió. Cuando no abrió, se dice.

| Fuente | DOI | Qué se comprobó | ¿Cambia algo? |
| --- | --- | --- | --- |
| Özcan, S. (2026). The effect of dialogic reading interventions on narrative skills in the preschool period: a systematic review. *Frontiers in Education, 11*. | [10.3389/feduc.2026.1817388](https://doi.org/10.3389/feduc.2026.1817388) | Se leyó en la revista. Revisión con metaanálisis de 16 estudios (11 ensayos aleatorizados) y más de 1800 niños de preescolar. Efecto global g = 0,62; más alto en la estructura del relato (g = 0,82). La ventaja de lo digital o con robots (g = 0,88 frente a 0,46 en papel) se apoya en pocos estudios, como advierte la autora. | No. **Ya está citada** en el PR #2 con la misma lectura. Se confirma que la cita es fiel. |
| Amaya-Medina, D.-R., Gonzalez-Fernández, D., Flores-González, J.-F. e Iturra-Osorio, D. (2025). Enseñanza de la conciencia fonológica en el aula para favorecer el aprendizaje de la lectura: una revisión sistemática. *Ocnos, 24*(2). | [10.18239/ocnos_2025.24.2.514](https://doi.org/10.18239/ocnos_2025.24.2.514) | Se leyó el resumen en la página de la revista, donde aparece el DOI (no se pudo abrir en `doi.org`). Revisión sistemática (PRISMA) de 18 programas en el aula. Enseñar conciencia fonológica en el aula es viable y ayuda, sobre todo, a estudiantes con dificultades. El resumen no da edades ni calidad de los estudios. | No por ahora. Es evidencia **en español** (pendiente del mes anterior) y apoya lo que el libro ya hace con rimas y sonidos. Es **moderada a débil** para decidir algo: es una revisión sistemática sin metaanálisis: no da tamaño de efecto. |
| Kim, P., Chin, J. H., Xie, Y., Brady, N., Yeh, T. y Yang, S. Young children's anthropomorphism of an AI chatbot: brain activation and the role of parent co-presence. Preprint arXiv 2512.02179 (2025). Una búsqueda la muestra en *International Journal of Human–Computer Interaction* (2026); no se confirmó: arXiv no registra revista ni DOI. | Revista: 10.1080/10447318.2026.2678532 (**no se pudo abrir**; se leyó el preprint en arXiv) | 23 niños de 5 a 6 años inventaron cuentos con un chatbot de IA, con su madre o padre, y con los dos. Los niños vieron más «humano» al adulto que a la IA. Cuánto «humano» veían a la IA no se relacionó con cuánto conversaban. Un hallazgo exploratorio sugiere que la presencia del adulto podría ayudar a algunos niños a entender la IA. | No. **Evidencia débil** (23 niños; el análisis del ánimo es exploratorio). Es coherente con la regla actual: el Guardián se usa acompañado por un adulto. No justifica cambios. |
| Tang, Lau y Du (2026). Effects and moderators of dialogic reading on children's reading literacy: a three-level meta-analysis on studies from 2000 to 2025. *International Journal of Educational Research*. | [10.1016/j.ijer.2026.102963](https://doi.org/10.1016/j.ijer.2026.102963) | El Dot investigador vio el título en ScienceDirect (el auditor no pudo confirmarlo), pero el resumen **no se pudo leer** (la revista bloquea la lectura automática). | Sigue pendiente. No se usa hasta que una persona lo lea. |
| *Learning from storybooks: using shared book reading to target 5- to 7-year-olds' metacognitive monitoring*. *Early Education and Development, 37*(5) (2026). | 10.1080/10409289.2026.2641476 (**no se pudo abrir**) | Solo se vio el título y la revista en el buscador; no se leyeron autores ni resultados. | No se usa. Muy pertinente para Transición a 2.° (enseñar a notar «esto no lo entendí»). Queda para leer a mano. |

**Descartado:** un estudio de Frontiers in Psychology (2026, DOI 10.3389/fpsyg.2026.1982563) sobre lectura dialógica en estudiantes sordos de 6.° y 7.°: no es la edad del libro. Tampoco se usaron blogs ni páginas comerciales que resumen estudios.

**Neuromitos:** ninguna fuente de este informe los usa. Al estudio de Kim y colaboradores, que mide actividad cerebral (fNIRS), **no** se le atribuyen conclusiones sobre «activar el cerebro» para aprender; solo se cita lo que observa sobre el acompañamiento del adulto.

## 2. Qué se propone (Dot_Lectura_Comprension)

**Ningún cambio nuevo al material de los cuentos.** Las propuestas del 23-10-2026 siguen vigentes y bien fundamentadas:

- Hacer preguntas sobre la estructura del relato: qué problema hay, cómo se resuelve y cómo termina.
- Organizar los pasos de la familia en «antes, durante y después» de leer.
- Incluir la técnica PEER en la guía docente.
- Pedir que el niño vuelva a contar el cuento con apoyos.

Este mes no aparece nada que las contradiga. Nota sobre la tarea programada: pide editar `public/data/cuentos.json`, pero ese archivo **ya no existe** y el validador prohíbe crearlo, porque el libro viaja cifrado (`docs/CONTENIDO.md`). Las propuestas por cuento van por `id` y campo, y una persona con la llave las aplica.

## 3. Qué revisó el auditor (Dot_Auditor_Riguroso)

Un subagente independiente, que no participó en la búsqueda, revisó este informe:

- La fidelidad de cada resumen frente a lo que se pudo leer.
- Que no haya texto de los cuentos ni nombres de personajes.
- Que no haya datos personales ni neuromitos.
- Que se diga con claridad cuáles DOI no se pudieron abrir.
- Que el lenguaje sea claro.

Veredicto: **aprobado con correcciones**. Se aplicaron las cinco correcciones del auditor del 27-10-2026: calificar bien la revisión de Ocnos, dar el efecto en la estructura del relato (g = 0,82), aclarar que la revista del estudio de Kim no se confirmó y que el auditor no pudo confirmar el título de Tang, Lau y Du. El archivo se llama `2026-10-seguimiento.md` y no `2026-10.md` porque ese nombre ya lo usan los PR #2 y #3.

`node scripts/validar.mjs`: ✓ (marco válido; `contenido/libro.json` no está en este equipo, como es normal).

## 4. Qué debe decidir una persona

1. **Revisar y resolver los PR #2, #3 y #4.** Son tres versiones de la misma tarea de octubre y se pisan entre sí: dos tocan `marco.json` y `PENDIENTES.md`. Lo más simple es quedarse con una base (#2 o #3), añadirle el complemento #4 y cerrar las demás. Mientras no se decida, cada mes se acumulan propuestas sin aplicar.
2. **Aprobar o rechazar el piloto «antes, durante y después» y las preguntas de estructura del relato** en los 6 cuentos piloto (`claude/propuestas-dots-2026-10.json`, en el proyecto privado). Es la propuesta con mejor evidencia de octubre, y este mes no hay nada en contra.
3. **Permitir que los Dots verifiquen los DOI.** Pueden habilitarse `api.crossref.org` y `doi.org` en la configuración de red de claude.ai, o una persona puede leer a mano Tang, Lau y Du (2026) y el estudio de metacognición de *Early Education and Development* (2026). Sin eso, esas fuentes no se pueden usar.

## 5. Para el próximo mes (noviembre de 2026)

- Ejecutar la tarea una sola vez por mes. En octubre corrió el 23 (tres veces en paralelo) y otra vez el 27.
- Si se aprueba el piloto, extender las propuestas a los cuentos recomendados de 2.° y 3.°.
- Leer el estudio de metacognición. Si se confirma, proponer una pregunta del tipo «¿Hubo una parte que no entendiste? ¿Cómo lo averiguamos?».
