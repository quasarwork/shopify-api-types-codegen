import { join } from 'path';
import { appConfig } from '@config/app.config';
import { ShopifyConfigApi, shopifyConfig } from '@config/shopify.config';
import { generate } from '@graphql-codegen/cli';

interface GenerateParams {
  graphSchemaUrl: string;
  shopifyAccessToken: string;
  typesPath: string;
  introspectionPath: string;
}

const generateShopifyApiTypesDefault = async ({
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
              'Content-Type': 'application/json',
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

export const buildConfigThenGenerateApiTypesDefault = async (
  api: ShopifyConfigApi,
  unfetchableApiAliases: string[],
) => {
  const { outDir } = appConfig;
  const { shop, backofficeApp, apis } = shopifyConfig;

  // Loop in supported apis
  for (const apiVersion of api.versions) {
    // Ignore unfetchable api slugs
    if (unfetchableApiAliases.indexOf(apiVersion.name) !== -1) continue;

    const graphSchemaUrl = `https://${shop}/${api.slug}/api/${apiVersion.code}/graphql.json`;
    const shopifyAccessToken = backofficeApp.accessToken;
    const typesPath = join(
      __dirname,
      `../../../${outDir}/api/${api.slug}/${apiVersion.code}/index.ts`,
    );
    const introspectionPath = join(
      __dirname,
      `../../../${outDir}/api/${api.slug}/${apiVersion.code}/graphql.schema.json`,
    );

    await generateShopifyApiTypesDefault({
      graphSchemaUrl,
      shopifyAccessToken,
      typesPath,
      introspectionPath,
    });
  }
};
