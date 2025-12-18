import fs from 'fs';
import path from 'path';

export type PropuestaMeta = {
  origen?: string;
  tipo?: string;
  'nombre-original'?: string;
  valido?: boolean;
  hayIngles?: boolean;
  [k: string]: unknown;
};

export type Propuesta = {
  filePath: string;
  meta: PropuestaMeta;
  body: string;
};

export type Grupo = {
  id: string;
  miembros: Propuesta[];
  canonical?: Propuesta;
  score?: number;
};

function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): Set<string> {
  const n = normalizeText(s);
  if (n.length === 0) return new Set();
  return new Set(n.split(/\s+/));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter((x) => b.has(x))).size;
  const union = new Set([...a, ...b]).size;
  if (union === 0) return 0;
  return inter / union;
}

export class ServicioDeduplicacionPropuestas {
  private proposalsDir: string;

  constructor(proposalsDir: string) {
    this.proposalsDir = proposalsDir;
  }

  async listarPropuestas(): Promise<Propuesta[]> {
    const files = await fs.promises.readdir(this.proposalsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    const out: Propuesta[] = [];
    for (const f of mdFiles) {
      const full = path.join(this.proposalsDir, f);
      const raw = await fs.promises.readFile(full, 'utf-8');
      const { meta, body } = this.parseFrontmatter(raw);
      out.push({ filePath: full, meta, body });
    }
    return out;
  }

  parseFrontmatter(raw: string): { meta: PropuestaMeta; body: string } {
    const fmMatch = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw);
    if (!fmMatch) return { meta: {}, body: raw.trim() };
    const fm = fmMatch[1];
    const body = fmMatch[2].trim();
    const meta: PropuestaMeta = {};
    for (const line of fm.split(/\n/)) {
      const m = /^\s*([\w-]+)\s*:\s*(.*)$/.exec(line);
      if (!m) continue;
      const key = m[1];
      let val: unknown = m[2];
      // simple types
      if (/^true$/i.test(String(val))) val = true;
      else if (/^false$/i.test(String(val))) val = false;
      else if (/^\d+$/.test(String(val))) val = parseInt(String(val), 10);
      meta[key] = val as any;
    }
    return { meta, body };
  }

  async agruparPorSimilitud(opts?: { threshold?: number }): Promise<Grupo[]> {
    const threshold = opts?.threshold ?? 0.85;
    const propuestas = await this.listarPropuestas();
    // Precompute tokens per proposal using name + body
    const items = propuestas.map((p) => {
      const name = String(p.meta['nombre-original'] ?? '');
      const keyText = (name + '\n' + p.body).slice(0, 10000);
      const tokens = tokenize(keyText);
      return { propuesta: p, tokens };
    });

    const grupos: Grupo[] = [];
    const visited = new Set<string>();

    for (let i = 0; i < items.length; i++) {
      if (visited.has(items[i].propuesta.filePath)) continue;
      const miembros = [items[i].propuesta];
      visited.add(items[i].propuesta.filePath);
      for (let j = i + 1; j < items.length; j++) {
        if (visited.has(items[j].propuesta.filePath)) continue;
        const sim = jaccard(items[i].tokens, items[j].tokens);
        if (sim >= threshold) {
          miembros.push(items[j].propuesta);
          visited.add(items[j].propuesta.filePath);
        }
      }
      const id = this.makeGroupId(miembros);
      grupos.push({ id, miembros });
    }

    // Select canonical per group using heuristics
    for (const g of grupos) {
      g.canonical = this.selectCanonical(g.miembros);
      g.score = this.computeGroupScore(g);
    }

    return grupos;
  }

  makeGroupId(miembros: Propuesta[]): string {
    // e.g., hash of first two file names
    const names = miembros.map((m) => path.basename(m.filePath)).sort();
    return normalizeText(names.join('-')).replace(/\s+/g, '-').slice(0, 120);
  }

  // Return canonical's meta for reporting/decisions
  canonicalMeta(g: Grupo) {
    return g.canonical ? g.canonical.meta : {};
  }

  selectCanonical(miembros: Propuesta[]): Propuesta {
    // Heurística: prefer valido=true, luego hayIngles=false (sin inglés), luego longitud mayor
    const sorted = miembros.slice().sort((a, b) => {
      const aVal = a.meta?.valido === true ? 2 : 0;
      const bVal = b.meta?.valido === true ? 2 : 0;
      if (aVal !== bVal) return bVal - aVal;
      const aEng = a.meta?.hayIngles === true ? 0 : 1;
      const bEng = b.meta?.hayIngles === true ? 0 : 1;
      if (aEng !== bEng) return bEng - aEng;
      return b.body.length - a.body.length;
    });
    return sorted[0];
  }

  computeGroupScore(g: Grupo): number {
    // Simple metric: fraction of members that are valid
    const validCount = g.miembros.filter((m) => m.meta?.valido === true).length;
    return validCount / Math.max(1, g.miembros.length);
  }

  async generarReporte(grupos: Grupo[], outPath: string): Promise<void> {
    const payload = {
      generatedAt: new Date().toISOString(),
      totalProposals: groupsReduceTotal(grupos),
      uniqueGroups: grupos.length,
      duplicates: groupsReduceDuplicates(grupos),
      groups: grupos.map((g) => ({
        id: g.id,
        canonical: path.relative(process.cwd(), g.canonical?.filePath ?? ''),
        canonicalMeta: g.canonical ? g.canonical.meta : {},
        miembros: g.miembros.map((m) => path.relative(process.cwd(), m.filePath)),
        score: g.score,
      })),
    };
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  async aplicarConsolidacion(grupos: Grupo[], opts?: { archiveDir?: string }): Promise<{ moved: number }>
  {
    const archiveDir = opts?.archiveDir ?? path.join(this.proposalsDir, '_archivadas');
    await fs.promises.mkdir(archiveDir, { recursive: true });
    let moved = 0;
    for (const g of grupos) {
      const canonical = g.canonical;
      if (!canonical) continue;
      for (const m of g.miembros) {
        if (m.filePath === canonical.filePath) continue;
        const dest = path.join(archiveDir, path.basename(m.filePath));
        await fs.promises.rename(m.filePath, dest);
        moved++;
      }
    }
    return { moved };
  }
}

function groupsReduceTotal(gs: Grupo[]): number {
  return gs.reduce((acc, g) => acc + g.miembros.length, 0);
}

function groupsReduceDuplicates(gs: Grupo[]): number {
  return gs.reduce((acc, g) => acc + Math.max(0, g.miembros.length - 1), 0);
}

export default ServicioDeduplicacionPropuestas;
