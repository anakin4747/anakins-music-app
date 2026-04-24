/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__e2e__/**/*.e2e.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.config.js' }],
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  // subsonic-api ships as ESM; allow babel-jest to transform it.
  transformIgnorePatterns: [
    'node_modules/(?!(subsonic-api)/)',
  ],
  globalSetup: './scripts/e2e-global-setup.ts',
  globalTeardown: './scripts/e2e-global-teardown.ts',
  testTimeout: 30000,
};
