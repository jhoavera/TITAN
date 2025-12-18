import { promises as fs } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { z } from 'zod';
import type { ADR } from '@servicios/adr/types';
import { ServicioADR } from '@servicios/adr/servicio-adr';

const EsquemaOpciones = z.object({
  rutaBase: z.string().optional(),
  secuenciaDryRun: z.boolean().optional(),
});

type Opciones = z.infer<typeof EsquemaOpciones>;

export type AccionLimpieza =
  | { tipo: 'eliminar'; ruta: string; razon: string }
  | { tipo: 'mover'; ruta: string; destino: string; razon: string }
  | { tipo: 'reportar-adr'; descripcion: string };

export class ServicioLimpieza {
  private basePath: string;

  constructor(opts?: { basePath?: string }) {
    this.basePath = opts?.basePath ?? process.cwd();
  }

  /** Detecta archivos y carpetas candidatos para limpieza y devuelve un listado de acciones propuestas (dry-run) */
  async proponerLimpieza(opts?: Opciones): Promise<AccionLimpieza[]> {
    const opciones = EsquemaOpciones.parse(opts ?? {});
    const raiz = opciones.rutaBase ? path.resolve(opciones.rutaBase) : this.basePath;
    const candidatos: AccionLimpieza[] = [];

    // Heurística 1: archivos temporales y editoriales
    const patronesTemporales = ['**/*.tmp', '**/*.log', '**/*.bak', '**/~*', '**/.DS_Store'];
    // Implementación simple: buscar por extensiones y nombres comunes
    const list = await this._listarRecursivo(raiz);
    for (const f of list) {
      const nombre = path.basename(f).toLowerCase();
      if (nombre === '.ds_store' || nombre.endsWith('.tmp') || nombre.endsWith('.log') || nombre.endsWith('.bak') || nombre.startsWith('~')) {
        candidatos.push({ tipo: 'eliminar', ruta: f, razon: 'archivo temporal o de editor' });
      }
    }

    // Heurística 2: carpetas de fixtures antiguas / tmp con patrón tmp-*
    for (const f of list) {
      const bn = path.basename(f).toLowerCase();
      if (bn.startsWith('tmp-') || bn.includes('fixtures') || bn.includes('tmp')) {
        // Si es carpeta, sugerir mover a carpeta de archivo
        const stats = await fs.stat(f);
        if (stats.isDirectory()) {
          const destino = path.join(this.basePath, 'tmp', 'artefactos-limpieza');
          candidatos.push({ tipo: 'mover', ruta: f, destino, razon: 'carpeta temporal o fixtures de revisión' });
        }
      }
    }

    // Heurística 3: archivos duplicados por contenido (hash simple) — implementación por tamaño + nombre
    const mapaContenido = new Map<string, string>();
    for (const f of list) {
      const stats = await fs.stat(f);
      if (!stats.isFile()) continue;
      const key = `${stats.size}`; // aproximación simple, luego se puede mejorar con hash
      if (mapaContenido.has(key)) {
        candidatos.push({ tipo: 'eliminar', ruta: f, razon: 'posible duplicado por tamaño' });
      } else {
        mapaContenido.set(key, f);
      }
    }

    // Heurística 4: nombres en inglés o mal escritos — generar propuesta ADR (no ejecutar cambio)
    const palabrasIngles = ['tmp', 'fixtures', 'migrations', 'migration', 'init'];
    for (const f of list) {
      const nombres = f.split(path.sep).map((s) => s.toLowerCase());
      for (const p of nombres) {
        if (palabrasIngles.includes(p)) {
          candidatos.push({ tipo: 'reportar-adr', descripcion: `Encontrado término en inglés o no estándar en ruta: ${f}` });
          break;
        }
      }
    }

    return candidatos;
  }

  /** Ejecuta las acciones de limpieza propuestas. Opciones: dryRun, commit */
  async evaluarAutoAprobacion(accion: AccionLimpieza): Promise<{ autoApprove: boolean; razones: string[] }> {
    const razones: string[] = [];
    if (accion.tipo === 'eliminar') {
      try {
        const stats = await fs.stat(accion.ruta).catch(() => null);
        if (!stats || !stats.isFile()) {
          razones.push('no-es-archivo');
          return { autoApprove: false, razones };
        }
        // Regla 1: archivo temporal por nombre es seguro
        const nombre = path.basename(accion.ruta).toLowerCase();
        if (nombre === '.ds_store' || nombre.endsWith('.tmp') || nombre.endsWith('.log') || nombre.endsWith('.bak') || nombre.startsWith('~')) {
          razones.push('archivo-temporal');
          return { autoApprove: true, razones };
        }

        // Regla 2: archivo pequeño (<1MB) y antiguo (>30 días)
        const tamano = stats.size;
        const edadMs = Date.now() - stats.mtime.getTime();
        const dias30 = 1000 * 60 * 60 * 24 * 30;
        if (tamano < 1024 * 1024 && edadMs > dias30) {
          razones.push('archivo-pequeno-y-antiguo');
          return { autoApprove: true, razones };
        }

        // Regla 3: duplicados por hash idéntico (evaluado comparando con otro candidate en el repo)
        // calcular hash simple
        const data = await fs.readFile(accion.ruta);
        const hash = require('crypto').createHash('sha256').update(data).digest('hex');
        // buscar otro archivo con mismo hash
        const lista = await this._listarRecursivo(this.basePath);
        for (const f of lista) {
          if (f === accion.ruta) continue;
          try {
            const s = await fs.stat(f);
            if (!s.isFile()) continue;
            const d = await fs.readFile(f);
            const h2 = require('crypto').createHash('sha256').update(d).digest('hex');
            if (h2 === hash) {
              razones.push('duplicado-hash-igual');
              return { autoApprove: true, razones };
            }
          } catch (_e) {
            continue;
          }
        }

        // Por defecto no auto-aprobar
        razones.push('regla-defecto-no-auto-aprobar');
        return { autoApprove: false, razones };
      } catch (_err) {
        return { autoApprove: false, razones: ['error-evaluacion'] };
      }
    } else if (accion.tipo === 'mover') {
      try {
        const stats = await fs.stat(accion.ruta).catch(() => null);
        if (!stats || !stats.isDirectory()) {
          return { autoApprove: false, razones: ['no-es-carpeta'] };
        }
        // Si carpeta es pequeña (<10 archivos) y antigua (>30 días), es segura para mover
        const entradas = await fs.readdir(accion.ruta);
        const edadMs = Date.now() - stats.mtime.getTime();
        const dias30 = 1000 * 60 * 60 * 24 * 30;
        if (entradas.length <= 10 && edadMs > dias30) {
          return { autoApprove: true, razones: ['carpeta-pequena-y-antigua'] };
        }
        return { autoApprove: false, razones: ['carpeta-no-segura-para-mover'] };
      } catch (_err) {
        return { autoApprove: false, razones: ['error-evaluacion'] };
      }
    }

    // reportar-adr nunca auto-aprueba
    return { autoApprove: false, razones: ['reportar-adr-no-auto'] };
  }

  async ejecutarLimpieza(acciones: AccionLimpieza[], opts?: { dryRun?: boolean; commit?: boolean; autor?: { nombre: string; email: string }; autoApprove?: boolean }): Promise<{ aplicadas: AccionLimpieza[]; noAplicadas: AccionLimpieza[] }> {
    const aplicadas: AccionLimpieza[] = [];
    const noAplicadas: AccionLimpieza[] = [];

    for (const accion of acciones) {
      try {
        if (opts?.dryRun) {
          noAplicadas.push(accion);
          continue;
        }

        // Evaluar auto-aprobación si se solicitó
        let autoOk = false;
        if (opts?.autoApprove) {
          const evalRes = await this.evaluarAutoAprobacion(accion);
          if (evalRes.autoApprove) {
            autoOk = true;
          } else {
            // si no es seguro y es eliminar o mover, convertir a reportar-adr para revisión humana
            if (accion.tipo === 'eliminar' || accion.tipo === 'mover') {
              // crear acción reportar-adr y seguir flujo
              const descripcion = `Acción no segura para auto-aprobar: ${accion.tipo} ${'ruta' in accion ? (accion as any).ruta : ''} — razones: ${evalRes.razones.join(',')}`;
              const nueva = { tipo: 'reportar-adr', descripcion } as AccionLimpieza;
              // reemplazar en lugar y procesar como reportar-adr
              const servicioAdr = new ServicioADR();
              const servicioGlosario = (await import('../glosario/servicio-glosario')).ServicioGlosario;

              const titulo = `Propuesta: normalizar ruta / término detectado`;
              const decision = `Se propone revisar y normalizar el término detectado: ${descripcion}`;
              const autor = opts?.autor?.nombre ?? 'automatizado-limpieza';

              try {
                const sg = new servicioGlosario(path.join(this.basePath, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca'));
                const terminoDetectado = descripcion.replace(/.*ruta: /i, '').split(path.sep).pop() ?? 'termino-detectado';
                const definicionPropuesta = `Propuesta automática: sugerir traducción o reemplazo para '${terminoDetectado}'. Revisar contexto y aprobar manualmente.`;
                const propuesta = await sg.crearPropuesta({ termino: terminoDetectado, definicion: definicionPropuesta, autor });
                const adr = await servicioAdr.crearADR({ titulo, autor, objetivo: 'Normalización de nombres y traducción a español técnico', decision: `${decision}\n\nPropuesta glosario: ${propuesta.ruta}` }, { commit: false });
                aplicadas.push({ tipo: 'reportar-adr', descripcion: `ADR creado: ${adr.id} (propuesta glosario: ${propuesta.ruta})` });
              } catch (err) {
                const adr = await servicioAdr.crearADR({ titulo, autor, objetivo: 'Normalización de nombres y traducción a español técnico', decision }, { commit: false });
                aplicadas.push({ tipo: 'reportar-adr', descripcion: `ADR creado: ${adr.id}` });
              }
              continue; // seguir siguiente acción
            }
          }
        }

        if (accion.tipo === 'eliminar') {
          // eliminar archivo
          await fs.rm(accion.ruta, { force: true, recursive: true });
          aplicadas.push(accion);
        } else if (accion.tipo === 'mover') {
          await fs.mkdir(accion.destino, { recursive: true });
          const nombre = path.basename(accion.ruta);
          const destino = path.join(accion.destino, nombre);
          await fs.rename(accion.ruta, destino);
          aplicadas.push(accion);
        } else if (accion.tipo === 'reportar-adr') {
          // Crear ADR de propuesta para revisión (no aplicar cambios automáticos de nomenclatura)
          const servicioAdr = new ServicioADR();
          const servicioGlosario = (await import('../glosario/servicio-glosario')).ServicioGlosario;

          const titulo = `Propuesta: normalizar ruta / término detectado`;
          const decision = `Se propone revisar y normalizar el término detectado: ${accion.descripcion}`;
          const autor = opts?.autor?.nombre ?? 'automatizado-limpieza';

          // Crear propuesta de glosario relacionada para que el equipo la revise
          const terminoDetectado = accion.descripcion.replace(/.*ruta: /i, '').split(path.sep).pop() ?? 'termino-detectado';
          const definicionPropuesta = `Propuesta automática: sugerir traducción o reemplazo para '${terminoDetectado}'. Revisar contexto y aprobar manualmente.`;

          try {
            const sg = new servicioGlosario(path.join(this.basePath, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca'));
            const propuesta = await sg.crearPropuesta({ termino: terminoDetectado, definicion: definicionPropuesta, autor });

            const adr = await servicioAdr.crearADR({ titulo, autor, objetivo: 'Normalización de nombres y traducción a español técnico', decision: `${decision}\n\nPropuesta glosario: ${propuesta.ruta}` }, { commit: false });
            aplicadas.push({ tipo: 'reportar-adr', descripcion: `ADR creado: ${adr.id} (propuesta glosario: ${propuesta.ruta})` });
          } catch (err) {
            // fallback: crear ADR sin propuesta de glosario
            const adr = await servicioAdr.crearADR({ titulo, autor, objetivo: 'Normalización de nombres y traducción a español técnico', decision }, { commit: false });
            aplicadas.push({ tipo: 'reportar-adr', descripcion: `ADR creado: ${adr.id}` });
          }
        }
      } catch (err) {
        // Registrar error por acción y continuar
        // eslint-disable-next-line no-console
        console.warn('No se pudo aplicar acción de limpieza:', accion, (err as Error).message);
        noAplicadas.push(accion);
      }
    }

    // Si commit solicitado, hacer commit global de los cambios aplicados
    if (opts?.commit) {
      try {
        const mensaje = `chore(limpieza): aplicar ${aplicadas.length} acciones de limpieza automatizada`;
        spawnSync('git', ['add', '-A'], { cwd: this.basePath });
        spawnSync('git', ['commit', '-m', mensaje, '--author', `${opts.autor?.nombre ?? 'automatizado'} <${opts.autor?.email ?? 'automatizado@local'}>`], { cwd: this.basePath });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Advertencia: no se pudo commitear acciones de limpieza:', (err as Error).message);
      }
    }

    return { aplicadas, noAplicadas };
  }

  private async _listarRecursivo(raiz: string): Promise<string[]> {
    const resultado: string[] = [];
    const apilar = [raiz];
    while (apilar.length) {
      const actual = apilar.pop() as string;
      const entradas = await fs.readdir(actual);
      for (const e of entradas) {
        const ruta = path.join(actual, e);
        const stats = await fs.stat(ruta);
        if (stats.isDirectory()) {
          apilar.push(ruta);
          resultado.push(ruta);
        } else {
          resultado.push(ruta);
        }
      }
    }
    return resultado;
  }
}
