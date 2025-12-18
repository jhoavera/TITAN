---
Titulo: Validación de nombres al crear elementos y registro de propuestas en el glosario
Fecha: 2025-12-15
Estado: aceptado
---

Resumen
-------

Se añade un servicio (`servicio-validacion-creacion`) que valida convenciones de nombres (archivos, carpetas y otros elementos) y registra automáticamente propuestas en `glosario-biblioteca/propuestas/` cuando se detectan nombres en inglés o que no cumplen las convenciones del proyecto.

Decisión
--------

- Implementar validador que: 1) verifica convenciones (minúsculas, sufijos `.prueba.ts` para pruebas), 2) detecta palabras en inglés mediante heurística mínima, 3) crea una propuesta en `glosario-biblioteca/propuestas/` para su revisión.
- Integrar el validador en los puntos de creación de Glosario y ADRs para que las propuestas se generen automáticamente sin bloquear la creación.

Consecuencias
------------

- Mejora de calidad y consistencia de nombres en el repositorio.  
- Facilita la creación de entradas en el glosario cuando aparecen términos en inglés o no estandarizados.  
- El proceso es no intrusivo: la creación sigue adelante aunque el validador detecte problemas; se genera una propuesta para revisión.
