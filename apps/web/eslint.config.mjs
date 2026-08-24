import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', '.next-diag/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
