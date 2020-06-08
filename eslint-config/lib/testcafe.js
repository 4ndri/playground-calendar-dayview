module.exports = {
  extends: ['./base'],
  overrides: [
    {
      extends: ['./base', 'plugin:testcafe/recommended'],
      files: ['e2e/**/*'],
      plugins: ['testcafe']
    }
  ]
};
