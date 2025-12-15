import { defineConfig } from 'vitest/config';

// Configuración Vitest en español-consciente: incluimos sufijo .prueba además de .test/.spec
export default defineConfig({
  test: {
    include: ['**/*.{test,spec,prueba}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'node',
    globals: false,
    passWithNoTests: false,
  },
});
