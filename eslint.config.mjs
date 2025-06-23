import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Global ignore disables all linting
  {
    ignores: [
      '**/dist/*',
      '**/build/*',
      '**/scripts/*',
      '**/playwright-report/*',
      '**/storybook-static/*',
      '**/.yarn/*'
    ]
  },

  // Base ES/TS lint rules
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // Vue rules (app workspace)
  // https://eslint.vuejs.org/
  {
    extends: [...pluginVue.configs['flat/recommended']],
    files: ['app/**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: tsParser
      }
    },
    rules: {
      'vue/no-unused-vars': 'error',
      'vue/multi-word-component-names': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/require-default-prop': 'off'
    }
  },

  // ES/TS rules (all workspaces)
  {
    files: ['**/*.{ts,js,vue,mjs,cjs}'],
    rules: {
      'no-debugger': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      'prefer-const': [
        'warn',
        {
          destructuring: 'all'
        }
      ]
    }
  },

  // console rules for ES/TS across all workspaces
  // use console.log during development, otherwise warn/error/debug for production
  {
    files: ['**/*.{ts,js,vue,mjs,cjs}'],
    ignores: ['app/tests/**', '**/*.stories.*', 'api/**'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error', 'debug'] }]
    }
  },

  // Integrate Prettier into linting
  // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended
)
