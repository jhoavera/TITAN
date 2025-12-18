import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import ServicioDeduplicacionPropuestas, { Propuesta, Grupo } from './deduplicacion-propuestas';

export type OpcionesLimpieza = {
  apply: boolean;
  umbralSimilitud: number;
  archivoReporte?: string;
  logMaxBytes: number;
  logMaxLineas: number;
  logLineasRetener: number;
  borrarFixtures: boolean;
};

export type ResultadoConsolidacion = {
  totalGrupos: number;
  gruposConDuplicados: number;
  archivosMovidos: string[];
  archivosConservados: string[];
  reporte: string;
};

export type ResultadoLog = {
  rotado: boolean;
  motivo?: string;
  bytesAntes: number;
  bytesDespues: number;
  lineasAntes: number;
  lineasDespues: number;
  snapshot?: string;
};

export type ResultadoFixtures = {
  accion: 'no-existe' | 'movido' | 'eliminado' | 'dry-run';
  destino?: string;
};

export type ResultadoLimpieza = {
  consolidacion: ResultadoConsolidacion;
  log: ResultadoLog;
  fixtures: ResultadoFixtures;
};

export class ServicioLimpiezaAvanzada {
  private readonly propuestasDir: string;
  private readonly logAuditoriaPath: string;
  private readonly fixturesDir: string;
  private readonly tmpBaseDir: string;

  constructor(cfg?: {
    propuestasDir?: string;
    logAuditoriaPath?: string;
    fixturesDir?: string;
    tmpBaseDir?: string;
  }) {
    this.propuestasDir = cfg?.propuestasDir ?? path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas');
    this.logAuditoriaPath = cfg?.logAuditoriaPath ?? path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/glosario-biblioteca/auditoria-prevalidacion.log');
    this.fixturesDir = cfg?.fixturesDir ?? path.resolve(process.cwd(), './tests/ci/fixtures/revision-flow');
    this.tmpBaseDir = cfg?.tmpBaseDir ?? path.resolve(process.cwd(), '../tmp');
  }

  async ejecutar(opts: OpcionesLimpieza): Promise<ResultadoLimpieza> {
    const consolidacion = await this.consolidarPropuestas(opts);
    const log = await this.rotarLog(opts);
    const fixtures = await this.limpiarFixtures(opts);
    return { consolidacion, log, fixtures };
  }

  private async consolidarPropuestas(opts: OpcionesLimpieza): Promise<ResultadoConsolidacion> {
    await fs.promises.mkdir(this.propuestasDir, { recursive: true });
    const svc = new ServicioDeduplicacionPropuestas(this.propuestasDir);
    const grupos = await svc.agruparPorSimilitud({ threshold: opts.umbralSimilitud });
    const gruposConDuplicados = grupos.filter((g) => g.miembros.length > 1);

    const archivosMovidos: string[] = [];
    const archivosConservados: string[] = [];

    if (opts.apply && gruposConDuplicados.length > 0) {
      const archiveDir = path.join(this.propuestasDir, '_archivadas');
      await fs.promises.mkdir(archiveDir, { recursive: true });

      for (const grupo of gruposConDuplicados) {
        const canonico = await this.seleccionarCanonico(grupo);
        archivosConservados.push(canonico.filePath);
        for (const miembro of grupo.miembros) {
          if (miembro.filePath === canonico.filePath) continue;
          const destino = path.join(archiveDir, path.basename(miembro.filePath));
          await fs.promises.rename(miembro.filePath, destino);
          archivosMovidos.push(miembro.filePath);
        }
      }
    } else {
      for (const grupo of gruposConDuplicados) {
        const canonico = await this.seleccionarCanonico(grupo);
        archivosConservados.push(canonico.filePath);
        for (const miembro of grupo.miembros) {
          if (miembro.filePath === canonico.filePath) continue;
          archivosMovidos.push(miembro.filePath);
        }
      }
    }

    const reporte = await this.escribirReporteConsolidacion({
      grupos,
      gruposConDuplicados,
      archivosMovidos,
      archivosConservados,
      destino: opts.archivoReporte,
      apply: opts.apply,
    });

    return {
      totalGrupos: grupos.length,
      gruposConDuplicados: gruposConDuplicados.length,
      archivosMovidos,
      archivosConservados,
      reporte,
    };
  }

  private async seleccionarCanonico(grupo: Grupo): Promise<Propuesta & { mtimeMs: number }> {
    const candidatos = await Promise.all(
      grupo.miembros.map(async (miembro) => {
        const stat = await fs.promises.stat(miembro.filePath);
        return { ...miembro, mtimeMs: stat.mtimeMs };
      })
    );

    const ordenados = candidatos.sort((a, b) => {
      const aValido = a.meta?.valido === true ? 1 : 0;
      const bValido = b.meta?.valido === true ? 1 : 0;
      if (aValido !== bValido) return bValido - aValido;

      const aSinIngles = a.meta?.hayIngles === false ? 1 : 0;
      const bSinIngles = b.meta?.hayIngles === false ? 1 : 0;
      if (aSinIngles !== bSinIngles) return bSinIngles - aSinIngles;

      if (a.mtimeMs !== b.mtimeMs) return b.mtimeMs - a.mtimeMs;

      const aLen = a.body.length;
      const bLen = b.body.length;
      return bLen - aLen;
    });

    return ordenados[0];
  }

  private async escribirReporteConsolidacion(params: {
    grupos: Grupo[];
    gruposConDuplicados: Grupo[];
    archivosMovidos: string[];
    archivosConservados: string[];
    destino?: string;
    apply: boolean;
  }): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const destino = params.destino ?? path.resolve(process.cwd(), 'reports', 'limpieza', `propuestas-${timestamp}.json`);
    await fs.promises.mkdir(path.dirname(destino), { recursive: true });
    const payload = {
      generado: new Date().toISOString(),
      apply: params.apply,
      totalGrupos: params.grupos.length,
      gruposConDuplicados: params.gruposConDuplicados.length,
      archivosMovidos: params.archivosMovidos.map((p) => path.relative(process.cwd(), p)),
      archivosConservados: params.archivosConservados.map((p) => path.relative(process.cwd(), p)),
      resumenGrupos: params.gruposConDuplicados.slice(0, 50).map((g) => ({
        id: g.id,
        miembros: g.miembros.map((m) => path.relative(process.cwd(), m.filePath)),
      })),
    };
    await fs.promises.writeFile(destino, JSON.stringify(payload, null, 2), 'utf-8');
    return destino;
  }

  private async rotarLog(opts: OpcionesLimpieza): Promise<ResultadoLog> {
    const resultBase: ResultadoLog = {
      rotado: false,
      bytesAntes: 0,
      bytesDespues: 0,
      lineasAntes: 0,
      lineasDespues: 0,
    };

    if (!fs.existsSync(this.logAuditoriaPath)) {
      return { ...resultBase, motivo: 'no-existe' };
    }

    const contenido = await fs.promises.readFile(this.logAuditoriaPath, 'utf-8');
    const lineas = contenido.split('\n');
    const bytesAntes = Buffer.byteLength(contenido, 'utf-8');
    const necesitaRotar = bytesAntes > opts.logMaxBytes || lineas.length > opts.logMaxLineas;

    if (!necesitaRotar) {
      return { ...resultBase, bytesAntes, bytesDespues: bytesAntes, lineasAntes: lineas.length, lineasDespues: lineas.length, motivo: 'sin-rotacion' };
    }

    const snapshot = path.resolve(process.cwd(), 'reports', 'logs', `auditoria-prevalidacion-${new Date().toISOString().replace(/[:.]/g, '-')}.log.gz`);

    if (opts.apply) {
      await fs.promises.mkdir(path.dirname(snapshot), { recursive: true });
      const gz = zlib.gzipSync(contenido);
      await fs.promises.writeFile(snapshot, gz);
      const lineasRetenidas = lineas.slice(-opts.logLineasRetener);
      const nuevoContenido = lineasRetenidas.join('\n');
      await fs.promises.writeFile(this.logAuditoriaPath, nuevoContenido, 'utf-8');
      const bytesDespues = Buffer.byteLength(nuevoContenido, 'utf-8');
      return {
        rotado: true,
        bytesAntes,
        bytesDespues,
        lineasAntes: lineas.length,
        lineasDespues: lineasRetenidas.length,
        snapshot,
      };
    }

    return {
      rotado: false,
      motivo: 'dry-run',
      bytesAntes,
      bytesDespues: bytesAntes,
      lineasAntes: lineas.length,
      lineasDespues: Math.min(opts.logLineasRetener, lineas.length),
      snapshot,
    };
  }

  private async limpiarFixtures(opts: OpcionesLimpieza): Promise<ResultadoFixtures> {
    if (!fs.existsSync(this.fixturesDir)) {
      return { accion: 'no-existe' };
    }

    if (!opts.apply) {
      return { accion: 'dry-run', destino: this.fixturesDir };
    }

    if (opts.borrarFixtures) {
      await fs.promises.rm(this.fixturesDir, { recursive: true, force: true });
      return { accion: 'eliminado' };
    }

    const destino = path.join(this.tmpBaseDir, `artefactos-auto-flow-${this.timestampCorto()}`, 'fixtures-revision-flow');
    await fs.promises.mkdir(path.dirname(destino), { recursive: true });
    await fs.promises.rename(this.fixturesDir, destino);
    return { accion: 'movido', destino };
  }

  private timestampCorto(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export default ServicioLimpiezaAvanzada;
