#!/usr/bin/env python3
import os, json, argparse
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument('--plan', required=True)
parser.add_argument('--dry-run', action='store_true')
parser.add_argument('--limit', type=int, default=0)
args = parser.parse_args()

with open(args.plan, encoding='utf-8') as fh:
    plan = json.load(fh)

actions = plan.get('actions', [])
if args.limit and args.limit>0:
    actions = actions[:args.limit]

now = datetime.utcnow().strftime('%Y-%m-%dT%H-%M-%SZ')
out = os.path.join(os.path.dirname(args.plan), f'trace-consol-sample-{now}.jsonl')

with open(out, 'w', encoding='utf-8') as fh:
    for a in actions:
        entry = {
            'timestamp': now,
            'plan_pattern': plan.get('pattern'),
            'action': a['action'],
            'from': a['from'],
            'to': a['to'],
            'reason': a.get('reason'),
            'dry_run': bool(args.dry_run)
        }
        fh.write(json.dumps(entry, ensure_ascii=False)+"\n")
        if args.dry_run:
            print('[dry-run] planificado:', entry['action'], entry['from'], '->', entry['to'])
        else:
            # execute action (move)
            try:
                os.makedirs(os.path.dirname(a['to']), exist_ok=True)
                os.rename(a['from'], a['to'])
                print('ejecutado:', a['from'], '->', a['to'])
            except Exception as e:
                print('error al ejecutar acción', a, e)

print('Trazas ->', out)
