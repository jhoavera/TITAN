# Servicio de Validación Semántica

Este servicio ofrece una función `validarSemantica(termino, sugerencia?)` que devuelve un `ResultadoSemantico` con campos para:

- `score`: confianza 0..1
- `valido`: booleano
- `razon` y `explicacion`: para trazabilidad
- `candidatos` y `ejemplos` para auditoría

Implementación actual: **Stub LLM** local (`StubLLM`) con heurísticas (mapa canónico, similitud Levenshtein, coincidencia por raíz). Está diseñado para ser reemplazado por una integración real con LLM local (ej. llama.cpp bindings) cuando sea necesario.

Uso CLI:

$ ./scripts/ci/validar-semantica.ts <termino> [sugerencia]

Salida JSON apta para consumo por agentes y por CI local.

Política: Mantener 100% trazabilidad y no aprobar cambios automatizados sin pasar por el flujo de ADRs.
