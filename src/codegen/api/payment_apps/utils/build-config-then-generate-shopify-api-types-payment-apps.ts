import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { appConfig } from '@config/app.config';
import { ShopifyConfigApi, shopifyConfig } from '@config/shopify.config';
import { generate } from '@graphql-codegen/cli';
import { INTROSPECTION_QUERY } from '../graphql/queries/INTROSPECTION_QUERY';

/**
 * For some reasons, even with valid credentials the introspection query genereated by
 * `@graphql-codegen/cli` fails for the payment apps api.
 * We have to manually generate the `graphql.schema.json` associated to the payment apps api
 * then run the type codegen.
 *
 * @todo: Remove this function when the issue is fixed.
 */

interface TypesGenerateParams {
  graphSchemaUrl: string;
  typesPath: string;
}

const generateShopifyApiTypesPaymentApps = async ({
  graphSchemaUrl,
  typesPath,
}: TypesGenerateParams): Promise<void> => {
  await generate(
    {
      schema: [
        {
          [graphSchemaUrl]: {},
        },
      ],
      generates: {
        [typesPath]: {
          plugins: ['typescript'],
        },
      },
    },
    true,
  );
};

interface GraphQLSchemaGenerateParams {
  graphSchemaUrl: string;
  shopifyAccessToken: string;
  introspectionPathDir: string;
}

const generateShopifyApiGraphQLSchemaPaymentApps = async ({
  graphSchemaUrl,
  shopifyAccessToken,
  introspectionPathDir,
}: GraphQLSchemaGenerateParams): Promise<void> => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': shopifyAccessToken,
    Cookie: 'request_method=POST',
  };

  const schemaResponse = await fetch(graphSchemaUrl, {
    method: 'POST',
    body: JSON.stringify({
      query:
        'query IntrospectionQuery {\r\n    __schema {\r\n      queryType {\r\n        name\r\n      }\r\n      mutationType {\r\n        name\r\n      }\r\n      subscriptionType {\r\n        name\r\n      }\r\n      types {\r\n        ...FullType\r\n      }\r\n      directives {\r\n        name\r\n        description\r\n        args {\r\n          ...InputValue\r\n        }\r\n        locations\r\n      }\r\n    }\r\n  }\r\n\r\n  fragment FullType on __Type {\r\n    kind\r\n    name\r\n    description\r\n    fields(includeDeprecated: true) {\r\n      name\r\n      description\r\n      args {\r\n        ...InputValue\r\n      }\r\n      type {\r\n        ...TypeRef\r\n      }\r\n      isDeprecated\r\n      deprecationReason\r\n    }\r\n    inputFields {\r\n      ...InputValue\r\n    }\r\n    interfaces {\r\n      ...TypeRef\r\n    }\r\n    enumValues(includeDeprecated: true) {\r\n      name\r\n      description\r\n      isDeprecated\r\n      deprecationReason\r\n    }\r\n    possibleTypes {\r\n      ...TypeRef\r\n    }\r\n  }\r\n\r\n  fragment InputValue on __InputValue {\r\n    name\r\n    description\r\n    type {\r\n      ...TypeRef\r\n    }\r\n    defaultValue\r\n  }\r\n\r\n  fragment TypeRef on __Type {\r\n    kind\r\n    name\r\n    ofType {\r\n      kind\r\n      name\r\n      ofType {\r\n        kind\r\n        name\r\n        ofType {\r\n          kind\r\n          name\r\n        }\r\n      }\r\n    }\r\n  }',
      variables: {},
    }),
    headers,
    redirect: 'follow',
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

  const schemaData = schemaResponse.data;

  if (!existsSync(introspectionPathDir))
    mkdirSync(introspectionPathDir, { recursive: true });

  writeFileSync(
    `${introspectionPathDir}/graphql.schema.json`,
    JSON.stringify(schemaData),
  );
};

export const buildConfigThenGenerateApiTypesPaymentApps = async (
  api: ShopifyConfigApi,
  unfetchableApiAliases: string[],
): Promise<void> => {
  const { outDir } = appConfig;
  const { paymentApps } = shopifyConfig;

  // Loop in supported apis
  for (const apiVersion of api.versions) {
    // Ignore unfetchable api slugs
    if (unfetchableApiAliases.indexOf(apiVersion.name) !== -1) continue;

    const graphSchemaUrl = `https://${paymentApps.shop}/${api.slug}/api/${apiVersion.code}/graphql.json`;

    const typesPath = join(
      __dirname,
      `../../../../../${outDir}/api/${api.slug}/${apiVersion.code}/index.ts`,
    );
    const introspectionPathDir = join(
      __dirname,
      `../../../../../${outDir}/api/${api.slug}/${apiVersion.code}`,
    );

    await generateShopifyApiGraphQLSchemaPaymentApps({
      graphSchemaUrl,
      shopifyAccessToken: paymentApps.accessToken,
      introspectionPathDir,
    });

    await generateShopifyApiTypesPaymentApps({
      graphSchemaUrl: `${introspectionPathDir}/graphql.schema.json`,
      typesPath,
    });
  }
};
