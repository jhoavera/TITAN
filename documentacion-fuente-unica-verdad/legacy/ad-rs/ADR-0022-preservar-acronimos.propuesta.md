# ADR-0022: Política de preservación de acrónimos y nombres no traducibles

## Estado: propuesta

### Resumen
Definir una lista blanca persistente de acrónimos y nombres técnicos que se preservarán en su forma original (inglés/convención establecida) en el proceso de normalización y traducción de nombres a Español Técnico Empresarial.

### Alcance
- Acrónimos técnicos (ej: API, ADR, CI/CD, TS, JS, MSP)
- Nombres de productos o identificadores que no deben traducirse por requisito técnico

### Propuesta
- Mantener un glosario único (`documentacion-ssot/glosario_proyecto.yml`) con entradas marcadas como `ACRONIMO - PRESERVAR por defecto`.
- El detector y las herramientas de propuesta deben leer y respetar este glosario automáticamente.
- Cualquier cambio o excepción debe documentarse y aprobarse mediante una ADR adicional.

### Reglas
1. Los acrónimos listados en el glosario se considerarán preservados y no serán traducidos ni transformados en renombrados automáticos.
2. Al generar propuestas de traducción, los tokens coincidentes con acrónimos preservados no se modificarán.
3. Si se requiere traducción de un acrónimo por razones legales o de producto, deberá generarse un ADR explicando la necesidad.

### Artefactos
- Actualizar `documentacion-ssot/glosario_proyecto.yml` con las entradas por defecto (ADR, API, MSP, TS, JS, CI, CD).
- Implementar la lectura y aplicación de esta lista en los scripts de detección y emparejamiento.

### Justificación técnica
Preservar acrónimos críticos evita romper integraciones, referencias externas y el comportamiento de herramientas que dependen de nomenclatura estandarizada.

