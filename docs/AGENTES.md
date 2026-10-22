# Dots del Jardín Mágico del Saber

Los Dots (agentes) mantienen el libro al día con la investigación en lectura, desarrollo infantil, neurociencia educativa, psicología y metodología. Trabajan solos, pero **nunca publican sin aprobación humana**: proponen cambios en un pull request y el equipo de Lenguaje de CENTEC decide.

## Calendario
Tarea programada en claude.ai: **«Dots Jardín Mágico – actualización pedagógica»**, el día 1 de cada mes a las 6:42 a. m. (hora de Colombia).

## Qué hace cada Dot

| Dot | Trabajo | Entrega |
| --- | --- | --- |
| `Dot_Investigador_SextoSentido` | Busca investigación revisada por pares del último año: comprensión lectora temprana, lectura dialógica y compartida, vocabulario, conciencia fonológica, funciones ejecutivas, desarrollo socioemocional, lectura en pantalla vs. papel, uso de IA con niños. Verifica cada DOI abriéndolo. | Hallazgos con cita y DOI en el informe del mes. |
| `Dot_Lectura_Comprension` | Convierte los hallazgos en mejoras concretas de `public/data/cuentos.json`: preguntas por nivel (literal, inferencial, crítico, creativo), retos para reinventar, guías docente y familia, vocabulario. | Cambios en el JSON, con `revision.estado` = «en revisión». |
| `Dot_Auditor_Riguroso` | Revisa lo que hizo el Dot de lectura (nunca lo propio): exactitud frente al texto del cuento, lenguaje apto para Transición a 3.°, sin neuromitos, sin datos personales, DOIs que existen. | Aprobado o lista de correcciones. |
| `Dot_Mejora_Continua` | Lee el informe del auditor y los comentarios docentes, prioriza y actualiza `docs/PENDIENTES.md`. | Pendientes ordenados. |

## Reglas
1. El **texto de los cuentos** solo se cambia si hay una razón fuerte (comprensión, edad, seguridad) y siempre como propuesta separada y explicada; los personajes y familias se respetan tal como están.
2. Nada de neuromitos (estilos de aprendizaje, cerebro izquierdo/derecho, 10 % del cerebro, gimnasia cerebral).
3. Ninguna cita sin DOI verificado. Si la evidencia es débil, se dice.
4. DBA del MEN solo con número y redacción oficial verificados; si no, «por verificar».
5. Correr `node scripts/validar.mjs` antes de abrir el pull request.
6. Informe del mes en `docs/informes/AAAA-MM.md`: qué se investigó, qué se propone, qué revisó el auditor y qué debe decidir una persona.
7. El pull request se titula «Dots: actualización pedagógica AAAA-MM» y **no se fusiona solo**.

## Cómo aprueba una persona
En GitHub, abrir el pull request del mes, leer el informe, comentar o pedir cambios y, si todo está bien, «Merge». Cloudflare publica en minutos. Para marcar el contenido como aprobado, cambiar `revision.estado` a «aprobado» con la fecha y quién aprobó.
