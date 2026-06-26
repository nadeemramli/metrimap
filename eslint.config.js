// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // Don't lint build output, caches, generated code, or vendored bundles.
  globalIgnores([
    'dist',
    'docs/.vitepress/**',
    'src/lib/prisma/generated/**',
    '**/*.min.js',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Intentional debt in this codebase — keep visible as warnings, not
      // build-blocking errors, so lint can act as a gate for REAL issues
      // (Rules of Hooks, undefined refs) which stay as errors.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
], storybook.configs["flat/recommended"]);
