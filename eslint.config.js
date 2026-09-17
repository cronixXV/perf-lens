const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',

      // client линтится своим client/eslint.config.js
      'client/**'
    ]
  },

  {
    files: ['server/src/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: __dirname,
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  {
    files: ['server/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  {
    files: [
      'eslint.config.js',
      '*.config.{js,cjs}',
      'server/**/*.{js,cjs}',
      'server/config/**/*.{js,cjs}',
      'config/**/*.{js,cjs}'
    ],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  }
]);
