#!/usr/bin/env bun
/*
 * scripts/refactorizar-idioma.ts
 * Script de refactorización guiada (modo dry-run por defecto).
 * - Llama a `scripts/revisar-idioma.ts --quiet` para obtener hallazgos
 * - Usa `ServicioValidacionNombres` para agrupar y sugerir acciones
 * - NO aplica cambios sin confirmación explícita y ADR aprobado
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { ServicioValidacionNombres } from "../src/servicios/servicio-validacion-nombres";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || !args.includes("--apply");

function ejecutarRevisarIdioma(): string {
  const res = spawnSync("bun", ["./scripts/revisar-idioma.ts", "--quiet"], { encoding: "utf8" });
  if (res.status !== 0) {
    console.error("Error al ejecutar revisar-idioma:", res.stderr || res.stdout);
    return "";
  }
  return res.stdout || "";
}

function agruparHallazgos(texto: string) {
  const lineas = texto.split(/\n/).filter(Boolean);
  const agrupado: Record<string, string[]> = {};
  for (const l of lineas) {
    // línea de ejemplo: - /path/file:line -> palabra="migration" ...
    const m = l.match(/-> palabra=\"([^\"]+)\"/);
    const f = l.match(/^-\s+([^:]+):/);
    if (m && f) {
      const palabra = m[1];
      const archivo = f[1];
      agrupado[palabra] = agrupado[palabra] || [];
      agrupado[palabra].push(archivo);
    }
  }
  return agrupado;
}

async function main() {
  console.log(dryRun ? "Modo dry-run: no se aplicarán cambios" : "Modo apply: los cambios se aplicarían (requiere ADR aprobado)");

  const salida = ejecutarRevisarIdioma();
  if (!salida) return process.exit(1);

  const agrupado = agruparHallazgos(salida);
  const validador = new ServicioValidacionNombres();

  const reporte: Array<{ termino: string; archivos: string[]; sugerencia?: string } > = [];

  for (const termino of Object.keys(agrupado)) {
    const sugerencia = validador.sugerirTraduccion(termino);
    reporte.push({ termino, archivos: Array.from(new Set(agrupado[termino])), sugerencia });
  }

  const outPath = path.resolve(process.cwd(), "reports/reporte-refactor-idioma.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ dryRun, fecha: new Date().toISOString(), reporte }, null, 2), "utf8");

  console.log(`Reporte creado: ${outPath}`);
  console.log(`Términos encontrados: ${reporte.length}`);
  for (const r of reporte) {
    console.log(`- ${r.termino} (${r.archivos.length} archivos) -> sugerencia: ${r.sugerencia}`);
  }

  if (!dryRun) {
    console.log("NOTA: En modo apply los renombrados solo se realizarán si existen ADRs aprobados para cada grupo de cambios.");
  }
}

main();
