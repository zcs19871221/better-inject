const tsConfig = require('./tsconfig.json');

const alias = (function createAlias() {
  if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    const map = Object.entries(tsConfig.compilerOptions.paths).reduce(
      (acc, [key, values]) => {
        values.forEach(value => {
          acc[key.replace(/\/\*$/, '(.*)$').replace(/^/, '^')] = value.replace(
            /\.?\/?(.*)\/\*$/,
            (match, dir) => `<rootDir>/${dir}/$1`,
          );
        });
        return acc;
      },
      {},
    );
    if (Object.keys(map).length > 0) {
      return {
        moduleNameMapper: map,
      };
    }
  }
  return {};
})();
console.log(__dirname);
module.exports = {
  automock: false,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '<rootDir>/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: ['<rootDir>/**/*.[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: '<rootDir>/test/coverage',
  coverageThreshold: {
    global: {
      brances: 50,
      functis: 50,
      lines: 50,
      statements: -10,
    },
  },
  errorOnDeprecated: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  ...alias,
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
};
