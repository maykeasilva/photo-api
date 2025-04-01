import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.mts',
    test: {
      name: 'unit',
      include: ['**/*.spec.ts'],
    },
  },
  {
    extends: './vitest.config.mts',
    test: {
      name: 'e2e',
      setupFiles: './test/setup-e2e.ts',
      include: ['**/*.e2e-spec.ts'],
    },
  },
])
