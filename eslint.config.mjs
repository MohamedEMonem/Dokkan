import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/vite.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  // ---------------------------------------------------------
  // 👇 TEAM MANIFESTO ENFORCEMENT
  // ---------------------------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {},
    rules: {
      // RULE: Strict TypeScript (No any)
      // Manifesto: "The use of the 'any' type is strictly forbidden." [cite: 15]
      '@typescript-eslint/no-explicit-any': 'error',

      // RULE: No Console Logs
      // Manifesto: "Bad: console.log(error) ... Good: this.logger.error" [cite: 62, 63]
      'no-console': 'error',

      // RULE: Naming Conventions
      // Manifesto: "Models: PascalCase ... Fields: camelCase" [cite: 50, 51]
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'], // Enforces PascalCase for Classes/Models [cite: 50]
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'], // Enforces camelCase for fields [cite: 51]
        },
      ],

      // RULE: Documentation Standard
      // Manifesto: "Every significant function... must have a JSDoc comment" [cite: 108]
      // This rule requires JSDoc for exported functions
      // Note: Requires eslint-plugin-jsdoc to be installed
      // 'jsdoc/require-jsdoc': [
      //   'warn',
      //   {
      //     require: {
      //       FunctionDeclaration: true,
      //       MethodDefinition: true,
      //       ClassDeclaration: false,
      //       ArrowFunctionExpression: false,
      //       FunctionExpression: false
      //     }
      //   }
      // ]
    },
  },
];
