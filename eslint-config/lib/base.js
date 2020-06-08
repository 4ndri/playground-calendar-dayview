module.exports = {
  extends: ['xo', 'xo-react', 'xo-typescript', 'plugin:prettier/recommended'],
  rules: {
    'capitalized-comments': 'off',
    'new-cap': 'off',
    'no-undef': 'warn',

    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off', // indent from prettier
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    "@typescript-eslint/no-unused-expressions": "off",
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',

    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-tag-spacing': 'off',
    'react/prop-types': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  }
};
