const { readFileSync } = require('fs');
const path = require('path');

// Reading the SWC compilation config for the spec files
const swcConfigPath = path.join(__dirname, '.spec.swcrc');
let swcJestConfig;

try {
  const rawConfig = readFileSync(swcConfigPath, 'utf-8');
  swcJestConfig = JSON.parse(rawConfig);
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error(
      `SWC configuration file not found at: ${swcConfigPath}\n` +
      `Please ensure .spec.swcrc exists in the api directory.`
    );
  } else if (error instanceof SyntaxError) {
    throw new Error(
      `Invalid JSON in SWC configuration file at: ${swcConfigPath}\n` +
      `JSON Parse Error: ${error.message}`
    );
  } else {
    throw new Error(
      `Failed to read SWC configuration file at: ${swcConfigPath}\n` +
      `Error: ${error.message}`
    );
  }
}

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

module.exports = {
  displayName: '@dokkan/api',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'coverage',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
  ],
  resolver: '@nx/jest/plugins/resolver',
};
