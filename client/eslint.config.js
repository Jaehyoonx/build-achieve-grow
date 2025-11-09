// Credits: Maja Frydrychowicz
// From https://gitlab.com/dawson-cst-cohort-2026/520/assignments/assignment2
// In metro-client dir 
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '19.1' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // ADDITIONAL RULES
      'react/prop-types': 'off',
      ////////// Possible Errors //////////
      'no-console': ['warn', {allow: ['error']}],
      'one-var': ['warn', 'never'],
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-extra-parens': 'warn',
      'block-scoped-var': 'warn',
      curly: ['warn', 'multi-line'],
      'no-await-in-loop': 'warn',
      'no-cond-assign': ['error', 'always'],
      'no-debugger': 'warn',
      'default-case': 'warn',
      eqeqeq: 'warn',
      'no-alert': 'warn',
      'no-eq-null': 'warn',
      'no-eval': 'warn',
      'no-implicit-coercion': 'warn',
      'no-lone-blocks': 'error',
      'no-loop-func': 'warn',
      'no-multi-str': 'warn',
      'no-self-compare': 'warn',
      'no-lonely-if': 'warn',
      ////////// Style for Graded Submissions //////////
      camelcase: 'error',
      'no-inline-comments': 'error',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-spacing': ['error', {before: false, after: true}],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/brace-style': ['error'],
      '@stylistic/max-len': ['error', 100],
      '@stylistic/no-tabs': 'error',
      '@stylistic/quotes': [
        'error',
        'single',
        {allowTemplateLiterals: 'always'}
      ],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/semi': 'error',
      '@stylistic/semi-spacing': 'error'

    },
  },
];
