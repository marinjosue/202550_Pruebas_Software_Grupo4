const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const { all } = require('./app');

module.exports = defineConfig([
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs'
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

    }
  },
  {
    files: ['tests/**/*.js'],
    ignores: ['tests/k6/**/*.js'], // Exclude k6 files from this config
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn']
    }
  },
  {
    files: ['tests/k6/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        __VU: 'readonly',
        __ITER: 'readonly'
      },
      sourceType: 'module' // Enable ES6 modules for k6 files
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn'],
      'import/no-unresolved': 'off' // Disable for k6 imports from URLs
    }
  }
]);
