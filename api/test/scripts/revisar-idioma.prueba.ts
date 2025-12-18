import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { main } from '@scripts/revisar-idioma';

describe('script revisar-idioma (dry-run)', () => {
  const tmp = path.resolve(process.cwd(), 'tmp-revisar-idioma');
  const file = path.join(tmp, 'ejemplo.md');
  let originalCwd = process.cwd();

  beforeEach(() => {
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
    fs.writeFileSync(file, 'Esta carpeta contiene migraciones y migracion examples.');
  });

  afterEach(() => {
    try {
      fs.unlinkSync(file);
      fs.rmdirSync(tmp);
    } catch (e) {
      // ignore
    }
  });

  it('detecta términos en archivos y no falla (dry-run)', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined as unknown as void);
    await expect(main(tmp)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
