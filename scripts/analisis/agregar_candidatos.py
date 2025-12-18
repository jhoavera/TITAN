#!/usr/bin/env python3
import os, json, csv, re
from datetime import datetime

IN_FILE = '/home/jhoavera/Documentos/TITAN/tmp/limpieza_dryrun.txt'
OUT_DIR = os.path.abspath('reports/limpieza')
os.makedirs(OUT_DIR, exist_ok=True)

counts = {}
paths = {}
with open(IN_FILE, encoding='utf-8') as fh:
    for line in fh:
        m = re.search(r" - ([0-9T:-]+Z-)?(.+\.md)", line)
        if m:
            name = m.group(2).strip()
            counts[name] = counts.get(name, 0) + 1
            paths.setdefault(name, []).append(line.strip())

now = datetime.utcnow().strftime('%Y-%m-%dT%H-%M-%SZ')
json_out = os.path.join(OUT_DIR, f'candidatos-por-patron-{now}.json')
csv_out = os.path.join(OUT_DIR, f'candidatos-por-patron-{now}.csv')

with open(json_out, 'w', encoding='utf-8') as out:
    json.dump({'generated_at': now, 'total_patterns': len(counts), 'counts': counts}, out, indent=2, ensure_ascii=False)

with open(csv_out, 'w', encoding='utf-8', newline='') as csvfh:
    w = csv.writer(csvfh)
    w.writerow(['pattern','count'])
    for k,v in sorted(counts.items(), key=lambda x: x[1], reverse=True):
        w.writerow([k,v])

print('Generado:', json_out, csv_out)
