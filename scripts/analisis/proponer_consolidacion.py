#!/usr/bin/env python3
import os, json, re
from datetime import datetime

ROOT = '/home/jhoavera/Documentos/TITAN/documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas'
OUT_DIR = '/home/jhoavera/Documentos/TITAN/reports/limpieza'
os.makedirs(OUT_DIR, exist_ok=True)

pattern = 'adr-adr-propuesta-normalizar-ruta-término-detectado.md'
# collect files
files = []
for f in os.listdir(ROOT):
    if f.endswith('.md') and pattern in f:
        full = os.path.join(ROOT, f)
        mtime = os.path.getmtime(full)
        files.append({'file': full, 'basename': f, 'mtime': mtime})

if not files:
    print('No se encontraron archivos para patrón', pattern)
    exit(0)

# pick newest as canonical
files_sorted = sorted(files, key=lambda x: x['mtime'], reverse=True)
canonical = files_sorted[0]
others = files_sorted[1:]

plan = {
    'pattern': pattern,
    'canonical': canonical['basename'],
    'count': len(files),
    'actions': []
}
for o in others:
    plan['actions'].append({'action': 'move_to_aplicadas', 'from': o['file'], 'to': os.path.join(ROOT, 'aplicadas', os.path.basename(o['file'])), 'reason': 'duplicado_consolidar'})

now = datetime.utcnow().strftime('%Y-%m-%dT%H-%M-%SZ')
json_out = os.path.join(OUT_DIR, f'plan-consolidacion-{pattern}-{now}.json')
with open(json_out, 'w', encoding='utf-8') as fh:
    json.dump(plan, fh, indent=2, ensure_ascii=False)
print('Plan de consolidación generado:', json_out)
