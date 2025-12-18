#!/usr/bin/env bun
import { crearTermino } from '@servicios/servicio-glosario-crud';

const [,, clave, termino, autor] = process.argv;
if (!clave || !termino || !autor) {
  console.error('Uso: bun scripts/servicios/crear-glosario-cli.ts <clave> <termino> <autor>');
  process.exit(1);
}

crearTermino({ clave, termino, definicion: 'Definición inicial (editar).', autor, fecha: new Date().toISOString(), estado: 'pendiente' });
console.log('Término de glosario creado:', clave);
