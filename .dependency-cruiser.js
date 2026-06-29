/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This dependency is part of a circular relationship.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'core-bounds',
      severity: 'error',
      comment: 'Core must not depend on apps, infrastructure, validation, or UI frameworks.',
      from: { path: '^packages/core/src' },
      to: {
        path: [
          '^apps',
          '^packages/validation',
          'node_modules/@nestjs',
          'node_modules/react',
          'node_modules/next',
          'node_modules/@prisma',
        ],
      },
    },
    {
      name: 'validation-bounds',
      severity: 'error',
      comment: 'Validation must not depend on core or apps.',
      from: { path: '^packages/validation/src' },
      to: { path: ['^packages/core', '^apps'] },
    },
    {
      name: 'shared-bounds',
      severity: 'error',
      comment: 'Shared must not depend on ANY other local package.',
      from: { path: '^packages/shared/src' },
      to: { path: ['^packages/(?!shared)', '^apps'] },
    },
    {
      name: 'types-bounds',
      severity: 'error',
      comment: 'Types must not depend on ANY other local package.',
      from: { path: '^packages/types/src' },
      to: { path: ['^packages/(?!types)', '^apps'] },
    },
    {
      name: 'testing-isolation',
      severity: 'error',
      comment: 'Production code must never import testing tools.',
      from: { pathNot: '^packages/testing|^apps/.+\\.test\\.ts' },
      to: { path: '^packages/testing' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg'],
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
