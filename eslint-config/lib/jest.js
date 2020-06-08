module.exports = {
  extends: ['./base'],
  overrides: [
    {
      extends: ['./base', 'plugin:jest/recommended'],
      files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts'],
      excludedFiles: ['e2e/*'],
      env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
      },
      plugins: ['jest']
    }
  ]
};
