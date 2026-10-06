/** Logic-only tests (rules, maths, resume): plain Node, no React Native runtime. */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  // The marketing site in site/ is a separate project.
  modulePathIgnorePatterns: ['<rootDir>/site/'],
  transform: { '^.+\\.(ts|tsx|js)$': ['babel-jest', { presets: ['babel-preset-expo'] }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
