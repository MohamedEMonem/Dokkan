const { readFileSync } = require('fs');

// Reading the SWC compilation config for the spec files
let swcJestConfig;
try {
  swcJestConfig = JSON.parse(
    readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8')
  );
} catch (error) {
  throw new Error(
    `Failed to load SWC configuration from ${__dirname}/.spec.swcrc: ${error.message}`
  );
}

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

module.exports = {
  displayName: '@omni-store/api-e2e',
  preset: '../jest.preset.js',
  globalSetup: '<rootDir>/src/support/global-setup.ts',
  globalTeardown: '<rootDir>/src/support/global-teardown.ts',
  setupFiles: ['<rootDir>/src/support/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
};
