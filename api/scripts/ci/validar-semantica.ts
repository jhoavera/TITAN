#!/usr/bin/env bun
import { validarSemantica } from '../../src/servicios/servicio-validacion-semantica';

async function main(): Promise<void> {
  const [, , termino, sugerencia] = process.argv;
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: validar-semantica <termino> [sugerencia]');
    console.log('Salida: JSON con campos { score, valido, explicacion, candidatos }');
    console.log('Nota: para usar LLM real, configure la variable de entorno SEMANTIC_VALIDATOR');
    process.exit(0);
  }
  if (!termino) {
    console.error('Error: se requiere <termino>\nUso: validar-semantica <termino> [sugerencia] (use --help para más info)');
    process.exit(2);
  }
  try {
    const res = await validarSemantica(termino, sugerencia);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error ejecutando validación semántica:', e);
    process.exit(3);
  }
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
