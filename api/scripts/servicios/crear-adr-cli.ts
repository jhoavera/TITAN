#!/usr/bin/env bun
import { crearADR } from '@servicios/servicio-adr-crud';

const [,, id, titulo, autor] = process.argv;
if (!id || !titulo || !autor) {
  console.error('Uso: bun scripts/servicios/crear-adr-cli.ts <id> <titulo> <autor>');
  process.exit(1);
}

crearADR({ id, titulo, autor, fecha: new Date().toISOString(), estado: 'pendiente', decision: '' });
console.log('ADR creado:', id);
