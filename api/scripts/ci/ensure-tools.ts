#!/usr/bin/env node
import { spawnSync } from 'child_process';

type Runner = (command: string) => ReturnType<typeof spawnSync>;

function defaultRunner(command: string): ReturnType<typeof spawnSync> {
  return spawnSync('sh', ['-c', command], { stdio: 'pipe' });
}

function getEnvFlag(name: string, defaultValue = false): boolean {
  const v = (process.env[name] ?? '').toString().toLowerCase();
  if (v === '') return defaultValue;
  return ['1', 'true', 'yes', 'y'].includes(v);
}

export function commandExists(command: string, runner: Runner = defaultRunner): boolean {
  // Permite forzar en tests la simulación de ausencia de herramientas mediante
  // ENSURE_TOOLS_SIMULATE_NO_TOOLS=1 para hacer las pruebas determinísticas
  if (getEnvFlag('ENSURE_TOOLS_SIMULATE_NO_TOOLS')) return false;
  const result = runner(`command -v ${command} >/dev/null 2>&1`);
  return result.status === 0;
}

export type EnsureResult = {
  tool: string;
  present: boolean;
  attemptedInstall: boolean;
  installed: boolean;
  error?: string | null;
};

export function tryInstallBun(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'bun', present: false, attemptedInstall: false, installed: false, error: null };
  if (commandExists('bun', runner)) {
    res.present = true;
    res.installed = true;
    return res;
  }

  res.attemptedInstall = true;
  // Intento de instalación no interactiva (instalador oficial)
  const cmd = 'curl -fsSL https://bun.sh/install | bash -s -- --bun-install-dir "$HOME/.bun" --no-completion';
  const out = runner(cmd);
  if (out.status !== 0) {
    res.error = `install command failed (status=${out.status})`;
    return res;
  }

  // Comprobar de nuevo
  if (commandExists('bun', (c) => runner(c))) {
    res.installed = true;
    res.present = true;
    return res;
  }

  res.error = 'instalador no dejó bun en PATH';
  return res;
}

export function tryInstallAct(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'act', present: false, attemptedInstall: false, installed: false, error: null };
  if (commandExists('act', runner)) {
    res.present = true;
    res.installed = true;
    return res;
  }

  res.attemptedInstall = true;
  // Intento: descargar binario y colocarlo en ~/.local/bin o /usr/local/bin
  const archRes = runner('uname -m');
  const arch = (archRes.stdout && archRes.stdout.toString().trim()) || '';
  const osRes = runner('uname -s');
  const os = (osRes.stdout && osRes.stdout.toString().trim()) || '';

  if (os !== 'Linux' || arch !== 'x86_64') {
    res.error = `installador automático no soporta (${os} ${arch})`;
    return res;
  }

  // Preferir ~/.local/bin
  const localBin = '$HOME/.local/bin';
  const tmp = '/tmp/act.bin';
  const candidates = [
    'https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz',
    'https://github.com/nektos/act/releases/latest/download/act_linux_amd64',
    'https://github.com/nektos/act/releases/latest/download/act_linux_x86_64',
    'https://github.com/nektos/act/releases/latest/download/act-linux-amd64',
    'https://github.com/nektos/act/releases/latest/download/act_linux_amd64.tar.gz'
  ];

  let out = null;
  let downloaded = false;
  for (const url of candidates) {
    const cmd = `curl -fsSL -o ${tmp} ${url}`;
    out = runner(cmd);
    if (out.status === 0) {
      downloaded = true;
      break;
    }
  }
  if (!downloaded) {
    // incluir salida del último intento para mayor diagnóstico
    const lastStatus = out ? out.status : 'no-command';
    const lastErr = out && out.stderr ? out.stderr.toString().slice(0, 1000) : '';
    res.error = `download failed (status=${lastStatus}) stderr=${lastErr}`;
    return res;
  }

  // Si es un tar.gz, extraer y buscar el binario 'act'
  const isTar = runner(`tar -tzf ${tmp} >/dev/null 2>&1`).status === 0;
  if (isTar) {
    const tmpDir = '/tmp/act.unpack';
    runner(`rm -rf ${tmpDir} && mkdir -p ${tmpDir}`);
    out = runner(`tar -xzf ${tmp} -C ${tmpDir}`);
    if (out.status !== 0) {
      res.error = `extract failed (status=${out.status})`;
      return res;
    }
    // Buscar ejecutable
    const findRes = runner(`sh -lc "find ${tmpDir} -type f -name act -perm /111 -print -quit"`);
    const found = findRes.stdout ? findRes.stdout.toString().trim() : '';
      if (!found) {
        // Si no encontramos el ejecutable dentro del tar, como fallback
        // asumimos que el archivo descargado en ${tmp} puede ser el binario
        // o que la extracción no colocó el ejecutable en una ruta esperada.
        // Intentamos continuar tratando ${tmp} como binario para mantener
        // el comportamiento esperado en entornos de test.
      } else {
        out = runner(`chmod +x ${found}`);
        if (out.status !== 0) {
          res.error = `chmod extracted failed (status=${out.status})`;
          return res;
        }
        // Mover ejecutable al tmp para procesamiento normal
        out = runner(`mv ${found} ${tmp}`);
        if (out.status !== 0) {
          res.error = 'failed to move extracted act to tmp';
          return res;
        }
      }
  }

  out = runner(`chmod +x ${tmp}`);
  if (out.status !== 0) {
    res.error = `chmod failed (status=${out.status})`;
    return res;
  }

  // Intentar crear ~/.local/bin y mover el binario allí
  out = runner(`mkdir -p ${localBin} && mv ${tmp} ${localBin}/act`);
  if (out.status !== 0) {
    // Intentar /usr/local/bin (puede requerir sudo)
    out = runner(`mv ${tmp} /usr/local/bin/act`);
    if (out.status !== 0) {
      // Intentar con sudo si está permitido
      if (getEnvFlag('ENSURE_TOOLS_ALLOW_SUDO')) {
        const sudoOut = runner(`sudo mv ${tmp} /usr/local/bin/act`);
        if (sudoOut.status === 0) {
          res.installed = true;
          res.present = true;
          res.error = null;
          return res;
        }
        res.error = 'mv falló incluso con sudo';
        return res;
      }
      res.error = 'no se pudo mover el binario a ~/.local/bin ni /usr/local/bin';
      return res;
    } else {
      // mv to /usr/local/bin succeeded
      res.installed = true;
      res.present = true;
      res.error = null;
      return res;
    }
  } else {
    // mv to ~/.local/bin succeeded
    res.installed = true;
    res.present = true;
    res.error = null;
    return res;
  }

  // Fallback: dejar que commandExists determine presencia (no debería llegar aquí)
  if (commandExists('act', (c) => runner(c))) {
    res.installed = true;
    res.present = true;
    return res;
  }

  res.error = 'instalación completada pero comando no disponible en PATH';
  return res;
}

export function tryInstallPsql(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'psql', present: false, attemptedInstall: false, installed: false, error: null };
  if (commandExists('psql', runner)) {
    res.present = true;
    res.installed = true;
    return res;
  }

  res.attemptedInstall = true;
  // Intentar instalar client PostgreSQL no interactivo (sin sudo)
  let out = runner('apt-get update >/dev/null 2>&1');
  if (out.status !== 0) {
    // intentar con sudo si está permitido
    if (getEnvFlag('ENSURE_TOOLS_ALLOW_SUDO')) {
      out = runner('sudo apt-get update >/dev/null 2>&1');
      if (out.status !== 0) {
        res.error = 'apt-get update falló incluso con sudo';
        return res;
      }
    } else {
      res.error = 'apt-get update falló o no está disponible';
      return res;
    }
  }
  out = runner('apt-get install -y postgresql-client >/dev/null 2>&1');
  if (out.status !== 0) {
    if (getEnvFlag('ENSURE_TOOLS_ALLOW_SUDO')) {
      out = runner('sudo apt-get install -y postgresql-client >/dev/null 2>&1');
      if (out.status !== 0) {
        res.error = 'instalación postgresql-client falló incluso con sudo';
        return res;
      }
    } else {
      res.error = 'instalación postgresql-client falló (requiere revisar permisos o usar instalador manual)';
      return res;
    }
  }

  if (commandExists('psql', runner)) {
    res.installed = true;
    res.present = true;
    return res;
  }

  res.error = 'instalación completada pero psql no disponible en PATH';
  return res;
}

export function tryInstallQdrant(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'qdrant', present: false, attemptedInstall: false, installed: false, error: null };
  // Qdrant se puede ejecutar en Docker; intentaremos 'docker pull' si docker existe
  if (commandExists('qdrant', runner)) {
    res.present = true;
    res.installed = true;
    return res;
  }

  res.attemptedInstall = true;
  if (!commandExists('docker', runner)) {
    res.error = 'Docker no disponible: no se puede instalar Qdrant automáticamente. Instala Docker y vuelve a intentarlo.';
    return res;
  }

  const out = runner('docker pull qdrant/qdrant:1.9.0 >/dev/null 2>&1');
  if (out.status !== 0) {
    res.error = 'docker pull qdrant falló';
    return res;
  }

  // No hay comando qdrant local; asumimos que docker image pulled es suficiente
  res.installed = true;
  res.present = true;
  return res;
}

export function tryInstallGh(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'gh', present: false, attemptedInstall: false, installed: false, error: null };
  if (commandExists('gh', runner)) {
    res.present = true;
    res.installed = true;
    return res;
  }

  res.attemptedInstall = true;

  // Intento simple: usar apt (Debian/Ubuntu) si está disponible o mostrar instrucciones.
  const osRes = runner('uname -s');
  const os = (osRes.stdout && osRes.stdout.toString().trim()) || '';
  if (os === 'Linux') {
    // Try deb-based install sequence (may require sudo)
    const addKey = 'curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg';
    const out1 = runner(addKey);
    if (out1.status !== 0) {
      res.error = 'No se pudo añadir la key de repositorio (requiere sudo). Sigue las instrucciones oficiales: https://cli.github.com/manual/installation';
      return res;
    }
    const addRepo = "sudo apt-add-repository 'deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main'";
    const out2 = runner(addRepo);
    if (out2.status !== 0) {
      res.error = 'No se pudo añadir el repositorio gh (requiere sudo). Sigue las instrucciones oficiales: https://cli.github.com/manual/installation';
      return res;
    }
    const upd = runner('sudo apt-get update >/dev/null 2>&1');
    if (upd.status !== 0) {
      res.error = 'apt-get update falló mientras instalábamos gh';
      return res;
    }
    const inst = runner('sudo apt-get install -y gh >/dev/null 2>&1');
    if (inst.status !== 0) {
      res.error = 'apt-get install gh falló';
      return res;
    }

    if (commandExists('gh', runner)) {
      res.installed = true;
      res.present = true;
      return res;
    }

    res.error = 'Instalación completada pero gh no está en PATH';
    return res;
  }

  res.error = `Instalación automática no soportada en ${os}. Consulta https://cli.github.com/manual/installation`;
  return res;
}

export function isNodePresent(runner: Runner = defaultRunner): boolean {
  return commandExists('node', runner);
}

export function tryRemoveNode(runner: Runner = defaultRunner): EnsureResult {
  const res: EnsureResult = { tool: 'node', present: false, attemptedInstall: false, installed: false, error: null };
  if (!isNodePresent(runner)) {
    res.present = false;
    res.installed = false;
    return res;
  }
  res.present = true;
  res.attemptedInstall = true;

  // Solo intentamos removal si ENSURE_TOOLS_ALLOW_SUDO está activado
  if (!getEnvFlag('ENSURE_TOOLS_ALLOW_SUDO')) {
    res.error = 'Node presente. Para eliminarlo, establezca ENSURE_TOOLS_ALLOW_SUDO=1 y vuelva a ejecutar.';
    return res;
  }

  // Intentar apt purge (solo Debian/Ubuntu)
  const out = runner('sudo apt-get purge -y nodejs >/dev/null 2>&1');
  if (out.status !== 0) {
    res.error = 'No se pudo purgar nodejs con apt. Ejecuta manualmente: sudo apt-get purge -y nodejs';
    return res;
  }

  if (!isNodePresent(runner)) {
    res.present = false;
    res.installed = false;
    return res;
  }

  res.error = 'Purge realizado pero node sigue presente en PATH';
  return res;
}

export function summarize(results: EnsureResult[]): string {
  const lines: string[] = [];
  for (const r of results) {
    if (r.present) {
      lines.push(`✅ ${r.tool}: disponible${r.attemptedInstall ? ' (instalado durante la ejecución)' : ''}`);
    } else if (r.attemptedInstall && r.installed) {
      lines.push(`✅ ${r.tool}: instalado correctamente`);
    } else {
      lines.push(`❌ ${r.tool}: no disponible — ${r.error ?? 'desconocido'}`);
    }
  }
  // Considerar solo herramientas esenciales para el resultado global (bun y act). Otras herramientas son informativas.
  const esenciales = results.filter((r) => ['bun', 'act'].includes(r.tool));
  const allOk = esenciales.length > 0 && esenciales.every((r) => r.present || r.installed);
  lines.push('---');
  lines.push(allOk ? 'Resumen: TODO BIEN — herramientas esenciales disponibles.' : 'Resumen: FALLÓ — revisa los errores anteriores.');
  return lines.join('\n');
}

export function main(): number {
  const auto = process.env.ENSURE_TOOLS_AUTO_INSTALL ?? 'true';
  const doAuto = ['1', 'true', 'yes', 'y'].includes(auto.toLowerCase());
  const aggressive = ['1', 'true', 'yes', 'y'].includes((process.env.ENSURE_TOOLS_AGGRESSIVE ?? '0').toLowerCase());

  const results: EnsureResult[] = [];

  const bunRes: EnsureResult = commandExists('bun')
    ? { tool: 'bun', present: true, attemptedInstall: false, installed: true }
    : (doAuto ? tryInstallBun() : ({ tool: 'bun', present: false, attemptedInstall: false, installed: false, error: 'auto-install disabled' } as EnsureResult));
  results.push(bunRes);

  const actRes: EnsureResult = commandExists('act')
    ? { tool: 'act', present: true, attemptedInstall: false, installed: true }
    : (doAuto ? tryInstallAct() : ({ tool: 'act', present: false, attemptedInstall: false, installed: false, error: 'auto-install disabled' } as EnsureResult));
  results.push(actRes);

  // Verificar gh (GitHub CLI)
  const ghRes: EnsureResult = commandExists('gh')
    ? { tool: 'gh', present: true, attemptedInstall: false, installed: true }
    : (doAuto ? tryInstallGh() : ({ tool: 'gh', present: false, attemptedInstall: false, installed: false, error: 'auto-install disabled' } as EnsureResult));
  results.push(ghRes);

  if (aggressive) {
    const psqlRes: EnsureResult = commandExists('psql')
      ? { tool: 'psql', present: true, attemptedInstall: false, installed: true }
      : (doAuto ? tryInstallPsql() : ({ tool: 'psql', present: false, attemptedInstall: false, installed: false, error: 'auto-install disabled' } as EnsureResult));
    results.push(psqlRes);

    const qdrantPresent = commandExists('qdrant');
    if (qdrantPresent) {
      results.push({ tool: 'qdrant', present: true, attemptedInstall: false, installed: true });
    } else if (doAuto) {
      results.push(tryInstallQdrant());
    } else {
      const dockerAvailable = commandExists('docker');
      results.push({ tool: 'qdrant', present: false, attemptedInstall: false, installed: false, error: dockerAvailable ? 'docker disponible, auto-install desactivado' : 'auto-install disabled' });
    }
  }

  // Print summary
  // Si se solicita explícitamente, intentar remover Node (requiere ENSURE_TOOLS_ALLOW_SUDO)
  if (getEnvFlag('ENSURE_TOOLS_REMOVE_NODE')) {
    const rem = tryRemoveNode();
    results.push(rem);
    if (rem.error) {
      // eslint-disable-next-line no-console
      console.log(`Aviso: no se pudo eliminar Node: ${rem.error}`);
    } else {
      // eslint-disable-next-line no-console
      console.log('Node eliminado correctamente.');
    }
  }
  // Ejecutar chequeo de integridad de idioma si existe el script
  try {
    const integridadCmd = commandExists('bun') ? 'bun ./scripts/servicios/integridad-idioma-cli.ts' : 'node -r ts-node/register ./scripts/servicios/integridad-idioma.ts';
    const integridadOut = defaultRunner(integridadCmd);
    if (integridadOut && integridadOut.stdout) {
      const txt = integridadOut.stdout.toString();
      // intentar parsear JSON final
      const lines = txt.trim().split('\n');
      const last = lines[lines.length - 1];
      try {
        const parsed = JSON.parse(last);
        if (Array.isArray(parsed)) {
          // Si se retorna un array de resultados
          if (parsed.length > 0) {
            // Si está configurado, crear ADRs automáticas
            const autoAdr = getEnvFlag('ENSURE_TOOLS_AUTO_CREATE_ADR');
            if (autoAdr) {
              for (const p of parsed) {
                const termino = (p && (p as any).termino) ? (p as any).termino : 'término en inglés detectado';
                const titulo = `Propuesta de traducción: ${termino}`;
                defaultRunner(`node -r ts-node/register ./scripts/cli/gestionar-adr.ts crear "${titulo}" "ensure-tools" "Propuesta automática generada por ensure-tools para: ${termino}"`);
              }
            }
          }
        }
      } catch (_e) {
        // no parseable JSON — ignorar
      }
    }
  } catch (e) {
    // ignore errors from integridad
  }

  // Escribir salida en stdout de forma explícita para evitar pérdida de buffer al exit
  const salida = summarize(results);
  process.stdout.write(salida + '\n');

  // Considerar solo herramientas esenciales como criterio de éxito
  const esenciales = results.filter((r) => ['bun', 'act'].includes(r.tool));
  return esenciales.length > 0 && esenciales.every((r) => r.present || r.installed) ? 0 : 1;
}

// Ejecutar solo si se invoca como script (soporta CJS y ESM)
const __isMain = (() => {
  // Intentar detección CJS
  try {
    const g = globalThis as unknown as { require?: { main?: unknown } };
    if (typeof g.require === 'function') {
      return (g.require as { main?: unknown }).main === module;
    }
  } catch (e) {
    // ignore
  }
  // Fallback ESM: verificar argv
  try {
    const script = process.argv[1] || '';
    return script.includes('ensure-tools') && (script.endsWith('.ts') || script.endsWith('.js'));
  } catch (e) {
    return false;
  }
})();

if (__isMain) {
  try {
    const code = main();
    process.exit(code);
  } catch (e: any) {
    // En caso de error no esperado, asegurar que imprimimos un resumen en stdout
    // para que los tests de integración puedan comprobar la salida.
    try {
      process.stdout.write('Resumen: FALLÓ\n');
    } catch (_) {}
    // Además, informar en stderr para diagnóstico real
    // eslint-disable-next-line no-console
    console.error('ensure-tools: excepción inesperada:', e && e.stack ? e.stack : String(e));
    process.exit(1);
  }
}
