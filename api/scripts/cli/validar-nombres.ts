#!/usr/bin/env node
import { validarNombre } from '../../src/servicios/validar-nombres';

// CLI mínimo: recibe nombres como argumentos y muestra validación en JSON
function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: validar-nombres <nombre1> [<nombre2> ...]');
    process.exit(0);
  }

  const resultados = args.map(validarNombre);
  console.log(JSON.stringify(resultados, null, 2));
}

if (require.main === module) {
  main();
}
