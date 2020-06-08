module.exports = {
  extends: ['./lib/base'],
  overrides: [
    {
      extends: ['./lib/base', 'plugin:jest/recommended'],
      // files: ['**/*.test.js', '**/*.spec.js', '**/*.spec.{js,jsx,ts,tsx}', '**/*.spec.jsx', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.ts'],
      files: ['**/*.spec.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
      excludedFiles: ['e2e/*'],
      env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
      },
      plugins: ['jest']
    },
    {
      extends: ['./lib/base', 'plugin:testcafe/recommended'],
      files: ['e2e/**/*'],
      plugins: ['testcafe']
    }
  ]
};
