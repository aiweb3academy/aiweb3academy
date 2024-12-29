import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import parser from 'eslint-mdx'
import mdx from 'eslint-plugin-mdx'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:tailwindcss/recommended',
      'prettier',
    )
    .map(config => ({
      ...config,
      files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    })),
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],

    settings: {
      tailwindcss: {
        whitelist: ['roboto-mono'],
      },
    },

    rules: {
      'tailwindcss/classnames-order': 'off',

      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/image',
              message: 'Please use `next-image-export-optimizer` instead',
              allowTypeImports: true,
            },
          ],
        },
      ],

      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],

      'prefer-rest-params': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-types': 'off',
    },
  },
  {
    files: ['**/*.{md,mdx}'],

    plugins: {
      mdx,
    },

    languageOptions: {
      parser: parser,
      ecmaVersion: 13,
      sourceType: 'module',
    },

    settings: {
      'mdx/code-blocks': true,
    },

    rules: {
      'mdx/remark': 'error',
    },

    processor: 'mdx/remark',
  },
  {
    files: ['**/*.{md,mdx}/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],

    rules: {
      'no-unused-labels': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-import-assign': 'off',
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['src/pages/blog/**/*.{md,mdx}', 'src/code/**/*.{md,mdx}'],

    rules: {
      'mdx/remark': 'off',
    },
  },
]
