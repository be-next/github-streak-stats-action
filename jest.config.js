export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
};
