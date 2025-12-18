---
Titulo: Evitar duplicación de auditoría en repositorios cuando BD aplica triggers
Fecha: 2025-12-15
Estado: aceptado
---

Resumen
-------

Se documenta la decisión de que los repositorios de persistencia (Glosario y ADRs) **no** intenten insertar registros de auditoría si la base de datos tiene triggers/funciones que ya registran la auditoría (p. ej. `fn_registrar_auditoria`, `tg_auditar_*`).

Motivación
----------

- Evitar registros duplicados de auditoría (uno por la aplicación y otro por el trigger DB).
- Conservar atomicidad: preferimos el trigger DB para la consistencia atómica de la auditoría.

Decisión
--------

1. Se implementó una utilidad `hayTriggersAuditoria(db)` que detecta la presencia de la función/trigger de auditoría en la BD.
2. Los repositorios consultan dicha utilidad y únicamente realizan un intento de inserción en `auditoria_cambios` si la BD NO tiene implementado el mecanismo de triggers.
3. La migración `0002_triggers_auditoria.sql` sigue siendo la fuente de verdad para entornos productivos; la inserción desde repositorio actúa como respaldo para entornos de desarrollo o pruebas sin triggers.

Consecuencias
------------

- Menor probabilidad de duplicación en entornos productivos.
- Ligera sobrecarga de una consulta de detección (cacheada en proceso) en los repositorios.
