const config = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  semi: true,

  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  tailwindStylesheet: './apps/web/src/styles/globals.css',

  importOrder: ['<THIRD_PARTY_MODULES>', '^@/', '^@e2e/', '^[./]'],
};

export default config;
