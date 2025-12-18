#!/usr/bin/env bun
import { revisarYProponerAprobaciones } from '../../src/servicios/servicio-aprobacion-adrs';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const dryRun = args.includes('--dry-run') || !apply;
const testGuard = args.includes('--apply-when-tests-pass');
const applyTestCmdEnv = process.env.APPLY_TEST_CMD || 'bun test';

async function run() {
  console.log('[aplicar-aprobaciones] Ejecutando revisión de propuestas...');
  const { propuestas } = await revisarYProponerAprobaciones();
  console.log(`[aplicar-aprobaciones] propuestas detectadas: ${propuestas.length}`);

  const aptas = propuestas.filter(p => p.valido);
  console.log(`[aplicar-aprobaciones] propuestas aptas para aplicar: ${aptas.length}`);

  if (aptas.length === 0) {
    console.log('[aplicar-aprobaciones] No hay propuestas aptas. Salida.');
    process.exit(0);
  }

  if (dryRun) {
    console.log('[aplicar-aprobaciones] Dry-run: las siguientes propuestas serían aplicadas:');
    for (const p of aptas) console.log(` - ${p.termino} (score=${p.semScore || 0})`);
    process.exit(0);
  }

  if (testGuard) {
    console.log('[aplicar-aprobaciones] Ejecutando guardia de tests:', applyTestCmdEnv);
    try {
      execSync(applyTestCmdEnv, { stdio: 'inherit' });
    } catch (e) {
      console.error('[aplicar-aprobaciones] Las pruebas fallaron. No se aplicarán cambios.');
      process.exit(2);
    }
  }

  // Aplicar: crear archivos ADR si no existen y registrar en ad-rs/aplicadas/
  const adrsDir = process.env.ADRS_DIR ? path.resolve(process.env.ADRS_DIR) : path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
  const aplicadasDir = path.join(adrsDir, 'aplicadas');
  fs.mkdirSync(aplicadasDir, { recursive: true });

  const created: string[] = [];
  for (const p of aptas) {
    const filename = `${new Date().toISOString()}-aprobacion-${p.termino.replace(/[^a-z0-9]+/gi, '-')}.md`;
    const content = `# ADR automática - Propuesta para '${p.termino}'\n\n- Justificación: propuesta automática aprobada por heurísticas seguras.\n- score: ${p.semScore || 'n/a'}\n- trazabilidad: generado por servicio-aprobacion-adrs\n`;
    const dest = path.join(aplicadasDir, filename);
    fs.writeFileSync(dest, content, 'utf-8');
    created.push(dest);
  }

  // Git commit locally (no push)
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "chore(adrs): aplicar ${created.length} aprobaciones automaticas (local)"`, { stdio: 'inherit' });
    console.log('[aplicar-aprobaciones] Cambios commitados localmente. No se empuja por política.');
  } catch (e) {
    console.warn('[aplicar-aprobaciones] No se pudieron commitear cambios automáticamente o no hay cambios:');
    console.warn((e as Error).message);
  }

  console.log(`[aplicar-aprobaciones] Aplicadas: ${created.length}`);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
