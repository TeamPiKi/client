import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
  ...baseConfig,
  expoConfig,
  {
    /** NOTE: eslint-config-expo 56 에서 새로 켜진 규칙. 웹과 같은 기준 유지 */
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['dist/**', 'plugins/**'],
  },
]);
