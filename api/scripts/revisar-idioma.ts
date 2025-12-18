#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { validarNombre } from '../src/servicios/validar-nombres';
import { ServicioGlosario } from '../src/servicios/glosario';

// Escaneo simple (dry-run): busca palabras en inglés y propone entradas de glosario
export async function main(raizParam?: string, outPath?: string): Promise<void> {
  const raiz = raizParam ?? process.cwd();
  const palabras = ['migrations', 'migration', 'migrate', 'migraciones'];
  const archivos = await buscarArchivos(raiz);
  const propuestasRaw: { archivo: string; palabra: string; linea: number; contexto: string }[] = [];

  for (const archivo of archivos) {
    if (!archivo.endsWith('.ts') && !archivo.endsWith('.md') && !archivo.endsWith('.sql')) continue;
    try {
      const texto = fs.readFileSync(archivo, 'utf-8');
      const lineas = texto.split('\n');
      for (let i = 0; i < lineas.length; i++) {
        const l = lineas[i].toLowerCase();
        for (const p of palabras) {
          if (l.includes(p)) {
            propuestasRaw.push({ archivo, palabra: p, linea: i + 1, contexto: lineas[i].trim() });
          }
        }
      }
    } catch (e) {
      // skip
    }
  }

  // Agrupar por termino para generar reporte algo razonable
  const map = new Map<string, { termino: string; archivos: string[] }>();
  for (const r of propuestasRaw) {
    const key = r.palabra
    const cur = map.get(key) || { termino: key, archivos: [] }
    if (!cur.archivos.includes(r.archivo)) cur.archivos.push(r.archivo)
    map.set(key, cur)
  }

  const reporte = { generatedAt: new Date().toISOString(), reporte: Array.from(map.values()) };

  // ensure reports dir
  const outFile = outPath || path.resolve(process.cwd(), 'reports', 'reporte-refactor-idioma.json')
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, JSON.stringify(reporte, null, 2), 'utf-8')

  const servicio = new ServicioGlosario();
  const apply = process.argv.includes('--apply');
  const applyWhenTestsPass = process.argv.includes('--apply-when-tests-pass');
  console.log('Resumen revisar-idioma (modo %s):', apply ? 'apply' : (applyWhenTestsPass ? 'apply-when-tests-pass' : 'dry-run'));

  // Helper que ejecuta pruebas y devuelve booleano
  const ejecutarPruebasOK = () => {
    const testCmd = process.env.APPLY_TEST_CMD ?? 'bun run pruebas --runInBand';
    const { execSync } = require('child_process');
    try {
      console.log('[revisar-idioma] Ejecutando checks de pruebas con comando:', testCmd);
      execSync(testCmd, { stdio: 'inherit' });
      return true;
    } catch (e) {
      console.error('[revisar-idioma] Las pruebas fallaron. No se aplicarán cambios automáticos.');
      return false;
    }
  }

  // Determinar si aplicamos
  let shouldApply = apply;
  if (applyWhenTestsPass) {
    shouldApply = ejecutarPruebasOK();
    if (!shouldApply) process.exitCode = 2;
  }

  for (const entry of reporte.reporte) {
    const nombre = entry.termino
    const valid = validarNombre(nombre)
    console.log(`- termino="${entry.termino}" archivos=${entry.archivos.length} (sugerencia: ${valid.sugerencia ?? '—'})`)

    if (shouldApply) {
      // Crear entrada en glosario en estado pendiente (una por termino)
      servicio.crear({ termino: entry.termino, definicion: `Propuesta: ${valid.sugerencia ?? 'revisar traducción'}`, autor: 'revisar-idioma' });
      console.log(`  -> Entrada de glosario creada (estado pendiente) para '${entry.termino}'`);
    }
  }

  console.log('\nResumen: %d términos detectados', reporte.reporte.length);
}

export async function buscarArchivos(dir: string): Promise<string[]> {
  const resultados: string[] = [];
  const entradas = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entradas) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue;
      resultados.push(...(await buscarArchivos(p)));
    } else {
      resultados.push(p);
    }
  }
  return resultados;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: revisar-idioma [raiz] [--apply]');
    console.log('Escanea el repositorio en busca de términos en inglés y sugiere entradas de glosario.');
    console.log('Opciones: --apply  -> crear entradas pendientes en tmp-glosario.json');
    process.exit(0);
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
