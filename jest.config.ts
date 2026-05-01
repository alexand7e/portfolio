import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar config
  dir: './',
})

const config: Config = {
  // Framework de teste
  testEnvironment: 'jest-environment-jsdom',

  // Arquivo de setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],

  // Onde buscar os testes
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}', '<rootDir>/**/*.test.{ts,tsx}'],

  // Módulos a ignorar nos testes
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],

  // Alias de paths (mesmo do tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Coletar coverage
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],

  // Coverage path
  coverageDirectory: '<rootDir>/coverage',

  // Ignorar coverage de alguns arquivos
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],

  // Transform
  transform: {},

  // Reporters
  reporters: ['default'],

  // Clear mocks entre testes
  clearMocks: true,

  // Reset modules entre testes
  resetMocks: true,
}

export default createJestConfig(config)
