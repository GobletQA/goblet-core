module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: require('path').join(__dirname, '../'),
  },
  plugins: ['import', '@typescript-eslint', 'jest', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  globals: {
    jest: true,
    __DEV__: true,
    expect: true,
    React: true,
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: '16.9',
    },
  },
  rules: {
    /* General */
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'brace-style': ['error', 'stroustrup'],
    indent: [
      'error',
      2,
      {
        offsetTernaryExpressions: true,
        ignoredNodes: ['ConditionalExpression > CallExpression'],
        SwitchCase: 1,
      },
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'id-length': [
      'error',
      {
        min: 2,
        exceptions: ['y', 'x', 'i', 'e', '_', 'k', 'p', 'P', 'I'],
      },
    ],
    'one-var': ['error', 'never'],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'newline-per-chained-call': 2,
    'array-bracket-spacing': [
      'error',
      'always',
      {
        arraysInArrays: false,
        singleValue: false,
        objectsInArrays: false,
      },
    ],
    'no-use-before-define': 'off',
    'space-in-parens': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '_',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'src/routes/swagger.ts',
          'src/config/jest.setup.ts',
          '**/*.test.js',
          '**/*.spec.js',
          '**/*.test.ts',
          '**/*.spec.ts',
        ],
      },
    ],
    /* @typescript */
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '_',
      },
    ],
    '@typescript-eslint/no-var-requires': 0,
    /* Jest */
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    /* React */
    'react/jsx-curly-spacing': [
      2,
      {
        when: 'always',
        attributes: false,
        children: true,
        spacing: {
          objectLiterals: 'never',
        },
      },
    ],
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/no-children-prop': 0,
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'always',
      },
    ],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
