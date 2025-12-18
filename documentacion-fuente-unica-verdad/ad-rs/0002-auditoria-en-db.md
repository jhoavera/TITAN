---
Titulo: Registrar auditoría mediante triggers en la base de datos
Fecha: 2025-12-15
Estado: aceptado
---

Resumen
-------

Se aprueba la creación de funciones y triggers en la base de datos para registrar eventos de auditoría (CREAR, ACTUALIZAR, ELIMINAR) en la tabla `auditoria_cambios`. Los triggers capturan el `git_ref` cuando esté presente en la fila o mediante la variable de sesión `app.operador_git_ref`.

Motivación
----------

- Garantizar que la auditoría se registre de forma atómica junto a la modificación de datos.
- Reducir la posibilidad de pérdida de eventos de auditoría por fallos en la capa de aplicación.

Decisión
--------

Implementar la migración `0002_triggers_auditoria.sql` que crea las funciones `fn_registrar_auditoria` y `fn_actualizar_metadatos_version`, y añade triggers sobre `glosario_terminos` y `adrs`.

Consecuencias
------------

- La aplicación ya no depende exclusivamente de insertar registros de auditoría en la capa de repositorios, aunque los repositorios continuarán intentando registrar auditoría explícita en entornos sin triggers.
- Se añade una variable de sesión opcional `app.operador_git_ref` que puede ser utilizada por procesos que necesiten asociar un `git_ref` a una operación atómica.
