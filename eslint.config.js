const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const sonarjsPlugin = require('eslint-plugin-sonarjs');

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
      sonarjs: sonarjsPlugin,
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
      
      // SonarJS правила
      ...sonarjsPlugin.configs.recommended.rules,
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/todo-tag': 'warn',
    },
  },

  // Специальные правила для файлов с типами
  {
    files: ['src/types/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      // Отключаем некоторые SonarJS правила для файлов с типами
      'sonarjs/no-all-duplicated-branches': 'off',
      'sonarjs/no-identical-expressions': 'off',
      'sonarjs/no-identical-functions': 'off',
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

  // Правила для файлов с тестами
  {
    files: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    ignores: ['src/types/**/*.ts'],
    rules: {
      'sonarjs/no-skipped-tests': 'off',
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