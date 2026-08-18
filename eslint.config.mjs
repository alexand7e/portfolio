import coreWebVitals from 'eslint-config-next/core-web-vitals'

// Flat config: o Next 16 removeu `next lint`, o ESLint roda direto pela CLI.
export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'public/**'],
  },
  ...coreWebVitals,
]
