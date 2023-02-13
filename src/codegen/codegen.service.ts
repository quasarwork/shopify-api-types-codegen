import { generate } from '@graphql-codegen/cli';
import { copyFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { appConfig } from '@config/app.config';
import { shopifyConfig } from '@config/shopify.config';

interface GenerateParams {
  graphSchemaUrl: string;
  shopifyAccessToken: string;
  typesPath: string;
  introspectionPath: string;
}

// These keys are specified in config file but are not fetchable as is from Shopify
const unfetchableApis = ['release_candidate', 'latest'];

const generateShopifyApiTypes = async ({
  graphSchemaUrl,
  shopifyAccessToken,
  typesPath,
  introspectionPath,
}: GenerateParams) => {
  await generate(
    {
      schema: [
        {
          [graphSchemaUrl]: {
            headers: {
              'Content-Type': 'application/graphql',
              'X-Shopify-Access-Token': shopifyAccessToken,
            },
          },
        },
      ],
      generates: {
        [typesPath]: {
          plugins: ['typescript'],
        },
        [introspectionPath]: {
          plugins: ['introspection'],
        },
      },
    },
    true,
  );
};

/**
 * It loops in config file to generate every types related to the supported Shopify APIs
 * and versions.
 * @returns {void}
 */
const generateApiTypes = async () => {
  const { outDir } = appConfig;
  const { shop, backofficeApp, apis } = shopifyConfig;

  // Loop in supported apis
  for (const apiSlug in apis) {
    const { versions } = apis[apiSlug];

    for (const versionKey in versions) {
      // Ignore unfetchable api slugs
      if (unfetchableApis.indexOf(versionKey) !== -1) continue;

      const apiVersion = versions[versionKey];

      const graphSchemaUrl = `https://${shop}/${apiSlug}/api/${apiVersion}/graphql.json`;
      const shopifyAccessToken = backofficeApp.accessToken;
      const typesPath = join(
        __dirname,
        `../../${outDir}/${apiSlug}/api/${apiVersion}/index.ts`,
      );
      const introspectionPath = join(
        __dirname,
        `../../${outDir}/${apiSlug}/api/${apiVersion}/graphql.schema.json`,
      );

      await generateShopifyApiTypes({
        graphSchemaUrl,
        shopifyAccessToken,
        typesPath,
        introspectionPath,
      });
    }
  }
};

/**
 * Since some api keys are not fetchable as is from Shopify
 * (e.g. `release_candidate`, `latest`)
 * but we want to be able to import our types from it
 * (e.g. `import { SomeObject } from '@quasarwork/shopify-api-types/admin/api/latest'`)
 * we will create sort of aliases dir exports.
 * @returns {void}
 */
const generateUnfetchableApisTypes = () => {
  const { outDir } = appConfig;
  const { apis } = shopifyConfig;

  // Loop in supported apis
  for (const apiSlug in apis) {
    const { versions } = apis[apiSlug];

    for (const versionKey in versions) {
      // Ignore fetchable api slugs
      if (unfetchableApis.indexOf(versionKey) === -1) continue;

      const apiVersion = versions[versionKey];

      const typesDestinationDir = join(
        __dirname,
        `../../${outDir}/${apiSlug}/api/${versionKey}`,
      );

      if (!existsSync(typesDestinationDir))
        mkdirSync(typesDestinationDir, { recursive: true });

      const types = `export * from '../${apiVersion}';`;

      writeFileSync(`${typesDestinationDir}/index.ts`, types);
    }
  }
};

/**
 * It adds a folder containing some mnually added types that extends pre-defined types
 * of @shopify/shopify-api package.
 * @returns {void}
 */
const generateShopifyApiUtilsTypes = () => {
  const { outDir } = appConfig;

  const shopifyApiUtilsSourceDir = join(
    __dirname,
    '../shared/types/utils/shopify-api/index.types.ts',
  );

  const shopifyApiUtilsDestinationDir = join(
    __dirname,
    `../../${outDir}/utils/shopify-api`,
  );

  if (!existsSync(shopifyApiUtilsDestinationDir))
    mkdirSync(shopifyApiUtilsDestinationDir, { recursive: true });

  copyFileSync(
    shopifyApiUtilsSourceDir,
    `${shopifyApiUtilsDestinationDir}/index.ts`,
  );
};

/**
 * It gathers our functions and runs them when called from CLI.
 * @returns {void}
 */
const codegen = async () => {
  await generateApiTypes();
  generateUnfetchableApisTypes();

  generateShopifyApiUtilsTypes();
};

export default codegen();
