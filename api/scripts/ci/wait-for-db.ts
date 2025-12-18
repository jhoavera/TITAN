import { Client } from 'pg';

const url = process.env.TEST_DATABASE_URL ?? 'postgres://test:test@127.0.0.1:5432/test';
const timeoutMs = 30_000;
const retryInterval = 500;

const waitForDb = async () => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      await client.end();
      console.log('Base de datos lista:', url);
      return;
    } catch (e) {
      await new Promise((r) => setTimeout(r, retryInterval));
    }
  }
  throw new Error('Timeout esperando a la base de datos');
};

waitForDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
