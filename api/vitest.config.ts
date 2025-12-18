import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const raiz = fileURLToPath(new URL('./src', import.meta.url));
const raizScripts = fileURLToPath(new URL('./scripts', import.meta.url));
const raizTest = fileURLToPath(new URL('./test', import.meta.url));
const raizTests = fileURLToPath(new URL('./tests', import.meta.url));

const alias = [
  { find: '@', replacement: raiz },
  { find: '@nucleo', replacement: path.join(raiz, 'nucleo') },
  { find: '@modulos', replacement: path.join(raiz, 'modulos') },
  { find: '@api', replacement: path.join(raiz, 'api') },
  { find: '@compartido', replacement: path.join(raiz, 'compartido') },
  { find: '@tipos', replacement: path.join(raiz, 'tipos') },
  { find: '@utilidades', replacement: path.join(raiz, 'utilidades') },
  { find: '@rutas', replacement: path.join(raiz, 'rutas') },
  { find: '@componentes', replacement: path.join(raiz, 'componentes') },
  { find: '@ganchos', replacement: path.join(raiz, 'ganchos') },
  { find: '@servicios', replacement: path.join(raiz, 'servicios') },
  { find: '@infraestructura', replacement: path.join(raiz, 'infraestructura') },
  { find: '@scripts', replacement: raizScripts },
  { find: '@test', replacement: raizTest },
  { find: '@tests', replacement: raizTests },
];

// Configuración Vitest en español-consciente: incluimos sufijo .prueba además de .test/.spec
export default defineConfig({
  test: {
    include: ['**/*.{test,spec,prueba}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'node',
    globals: false,
    passWithNoTests: false,
  },
  resolve: {
    alias,
  },
});
