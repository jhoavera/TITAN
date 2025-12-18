import fs from 'fs/promises';
import path from 'path';
import { Client } from 'pg';

const url = process.env.TEST_DATABASE_URL ?? 'postgres://test:test@127.0.0.1:5432/test';

async function aplicar() {
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const migrationsDir = path.resolve(__dirname, '..', '..', 'src', 'infraestructura', 'base-de-datos', 'migraciones');
    const files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
    for (const f of files) {
      const sql = await fs.readFile(path.join(migrationsDir, f), 'utf-8');
      console.log('Aplicando migración:', f);
      await client.query(sql);
    }
    console.log('Migraciones aplicadas correctamente');
  } finally {
    await client.end();
  }
}

aplicar().catch((err) => { console.error(err); process.exit(1); });
