#!/usr/bin/env python3
import os
import json
import csv
from datetime import datetime
import re

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
import argparse
import fnmatch
parser = argparse.ArgumentParser(description='Genera un resumen de propuestas')
parser.add_argument('--out-dir', default=os.path.join(BASE, 'reports/limpieza'))
parser.add_argument('--exclude-pattern', action='append', default=[], help='Patrón de exclusión para rutas (puede repetirse)')
parser.add_argument('--base', default=BASE, help='Directorio base para buscar propuestas')
args = parser.parse_args()
BASE = os.path.abspath(args.base)
ROOTS = []
# find all 'propuestas' dirs under glosario-biblioteca, applying exclude patterns
for r, ds, fs in os.walk(BASE):
    if os.path.basename(r) == 'propuestas' and 'glosario-biblioteca' in r:
        skip = False
        for pat in args.exclude_pattern:
            # support simple fnmatch patterns or substring
            if fnmatch.fnmatch(r, pat) or pat in r:
                skip = True
                break
        if not skip:
            ROOTS.append(r)
OUT_DIR = os.path.abspath(args.out_dir)
os.makedirs(OUT_DIR, exist_ok=True)

stats = {
    'total_files': 0,
    'by_tipo': {},
    'by_origen': {},
    'valido': {'true': 0, 'false': 0, 'missing': 0},
    'hayIngles': {'true': 0, 'false': 0, 'missing': 0},
    'razones': {},
    'duplicados_candidates': 0,
}

file_list = []

for proposals_dir in ROOTS:
    for root, dirs, files in os.walk(proposals_dir):
        for f in files:
            if not f.endswith('.md'):
                continue
            path = os.path.join(root, f)
        stats['total_files'] += 1
        file_list.append(path)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        fm_match = re.search(r"^---\n(.*?)\n---\n", content, re.DOTALL | re.MULTILINE)
        fm = {}
        if fm_match:
            body = fm_match.group(1)
            # simple parse: key: value or key: [a,b]
            for line in body.splitlines():
                line = line.strip()
                if not line or ':' not in line:
                    continue
                k,v = line.split(':',1)
                k=k.strip()
                v=v.strip()
                # strip surrounding quotes
                v = v.strip()
                # try lists
                if v.startswith('[') and v.endswith(']'):
                    items = v[1:-1].strip()
                    if items:
                        vals = [s.strip().strip('"\'') for s in items.split(',')]
                        fm[k] = vals
                    else:
                        fm[k] = []
                else:
                    fm[k] = v.strip(' "\'')
        # aggregate
        tipo = fm.get('tipo','unknown')
        origen = fm.get('origen','unknown')
        stats['by_tipo'][tipo] = stats['by_tipo'].get(tipo,0)+1
        stats['by_origen'][origen] = stats['by_origen'].get(origen,0)+1
        valido = fm.get('valido', None)
        if valido is None:
            stats['valido']['missing'] += 1
        else:
            if str(valido).lower() in ('true','1','yes'):
                stats['valido']['true'] += 1
            else:
                stats['valido']['false'] += 1
        hayIngles = fm.get('hayIngles', None)
        if hayIngles is None:
            stats['hayIngles']['missing'] += 1
        else:
            if str(hayIngles).lower() in ('true','1','yes'):
                stats['hayIngles']['true'] += 1
            else:
                stats['hayIngles']['false'] += 1
        razones = fm.get('razones', [])
        if isinstance(razones, list):
            for r in razones:
                stats['razones'][r] = stats['razones'].get(r,0)+1
                if 'duplicad' in r.lower():
                    stats['duplicados_candidates'] += 1
        else:
            # linea con string
            if razones:
                stats['razones'][razones] = stats['razones'].get(razones,0)+1
                if 'duplicad' in str(razones).lower():
                    stats['duplicados_candidates'] += 1
        # filename heuristic
        if 'duplicad' in f.lower() or 'duplicad' in fm.get('nombre-original','').lower():
            stats['duplicados_candidates'] += 1

# dedupe duplicados_candidates (it may have double-counted within files)
# approximate: cap to total files
if stats['duplicados_candidates'] > stats['total_files']:
    stats['duplicados_candidates'] = stats['total_files']

now = datetime.utcnow().strftime('%Y-%m-%dT%H-%M-%SZ')
json_out = os.path.join(OUT_DIR, f'resumen-propuestas-{now}.json')
csv_out = os.path.join(OUT_DIR, f'resumen-propuestas-{now}.csv')

with open(json_out,'w',encoding='utf-8') as out:
    json.dump({'meta': {'generated_at': now, 'files_scanned': stats['total_files']}, 'stats': stats}, out, ensure_ascii=False, indent=2)

# write a simple CSV: metric, key, count
with open(csv_out,'w',encoding='utf-8', newline='') as csvfh:
    writer = csv.writer(csvfh)
    writer.writerow(['metric','key','count'])
    writer.writerow(['total_files','',''])
    writer.writerow(['total_files','files_scanned', stats['total_files']])
    for k,v in stats['by_tipo'].items():
        writer.writerow(['by_tipo',k,v])
    for k,v in stats['by_origen'].items():
        writer.writerow(['by_origen',k,v])
    for k,v in stats['valido'].items():
        writer.writerow(['valido',k,v])
    for k,v in stats['hayIngles'].items():
        writer.writerow(['hayIngles',k,v])
    for k,v in stats['razones'].items():
        writer.writerow(['razones',k,v])
    writer.writerow(['duplicados_candidates','',stats['duplicados_candidates']])

print('Resumen generado:')
print('  JSON ->', json_out)
print('  CSV  ->', csv_out)
