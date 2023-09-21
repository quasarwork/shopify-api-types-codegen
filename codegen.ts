import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './graphql.schema.json',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript'],
    },
  },
};

export default config;
