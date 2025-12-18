const fs=require('fs');
const p='api/test/servicios/fixtures/proponer-imports-apply/src/mod/a.ts';
console.log('exists',fs.existsSync(p));
const l=fs.readFileSync(p,'utf8');
const line0=l.split('\n')[0];
console.log('line0:', JSON.stringify(line0));
console.log('regex', /from\s+['"]\./.test(line0));
console.log('match', line0.match(/from\s+['"]([^'"]+)['"]/));
