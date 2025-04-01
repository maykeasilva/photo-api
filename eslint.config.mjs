import js from '@eslint/js'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import ts from 'typescript-eslint'

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['node_modules, dist'] },

  js.configs.recommended,
  ...ts.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier: pluginPrettier,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          semi: false,
          singleQuote: true,
          arrowParens: 'always',
          trailingComma: 'all',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:.*\\u0000$', '^node:'],
            ['^@?\\w.*\\u0000$', '^@?\\w'],
            ['(?<=\\u0000)$', '^'],
            ['^\\..*\\u0000$', '^\\.'],
          ],
        },
      ],
    },
  },
]
