import prettier from 'eslint-config-prettier';
import * as hermesEslint from 'hermes-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'flow-typed/**'],
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: hermesEslint,
      parserOptions: {
        sourceType: 'module',
        enableFlow: true,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLUListElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLTemplateElement: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLLIElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLElement: 'readonly',
        DocumentFragment: 'readonly',
        Event: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.cjs', 'postcss.config.js', 'commitlint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        process: 'readonly',
      },
    },
  },
  prettier,
];
