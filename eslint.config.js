const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  // Базовые правила для всех TypeScript файлов
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          parser: 'typescript',
          maxLineLength: 120,
          printWidth: 120,
          endOfLine: 'auto',
        },
      ],
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Специальные правила для файлов с типами
  {
    files: ['src/types/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Правила для обычных TS файлов (исключая типы)
  {
    files: ['**/*.ts'],
    ignores: ['src/types/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  // Игнорируемые файлы
  {
    ignores: [
      'node_modules/',
      'dist/',
      'ci/',
      '.vscode/',
      '*.js',
      '*.mjs',
      '*.cjs'
    ],
  },
];