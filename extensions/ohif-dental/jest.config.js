const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '@ohif/core': '<rootDir>/../../platform/core/src',
  },
};
