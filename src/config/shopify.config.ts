import { get } from 'env-var';

import '@libs/utils/dotenv.lib';

export const shopifyConfig = {
  shop: get('SHOP').required().asString(),

  // Shopify credentials from backoffice generated app
  backofficeApp: {
    apiKey: get('SHOPIFY_BACKOFFICE_APP_API_KEY').required().asString(),
    apiSecret: get('SHOPIFY_BACKOFFICE_APP_API_SECRET').required().asString(),
    accessToken: get('SHOPIFY_BACKOFFICE_APP_ACCESS_TOKEN')
      .required()
      .asString(),
  },

  // Supported apis
  apis: {
    // https://shopify.dev/docs/api/admin-graphql
    admin: {
      // Supported versions
      versions: {
        release_candidate: '2023-04',
        latest: '2023-01',

        unstable: 'unstable',
        April23: '2023-04',
        January23: '2023-01',
        October22: '2022-10',
        July22: '2022-07',
        April22: '2022-04',
      },
    },
  },
};
