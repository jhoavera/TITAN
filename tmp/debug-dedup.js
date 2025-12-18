const m = require('./src/servicios/servicio-deduplicacion-propuestas.ts');
const fs = require('fs');
const path = require('path');
const adrs = path.resolve(process.cwd(), 'documentacion-fuente-unica-verdad/ad-rs');
if (!fs.existsSync(adrs)) fs.mkdirSync(adrs, { recursive: true });
fs.writeFileSync(path.join(adrs, 'tmp-propuesta-a.md'), '---\ntitulo: "Propuesta: traducir \"migrations\""\nfecha: "2025-12-16T00:00:00Z"\n---\n');
fs.writeFileSync(path.join(adrs, 'tmp-propuesta-b.md'), '---\ntitulo: "Propuesta: traducir \"migrate\""\nfecha: "2025-12-16T00:00:00Z"\n---\n');
console.log('listar', m.listarPropuestas().map(p => p.titulo));
console.log('grupos', m.agruparYDeduplicar(m.listarPropuestas()));
