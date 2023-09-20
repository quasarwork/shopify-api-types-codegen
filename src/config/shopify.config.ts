import { get } from 'env-var';

import '@libs/utils/dotenv.lib';
import { getSupportedShopifyAdminApiVersions } from '@libs/helpers/shopify/get-shopify-admin-api-versions';
import {
  ShopifyApiVersion,
  SupportedShopifyApiSlugs,
} from '@shared/types/dev/shopify-custom.types';

interface ShopifyConfig {
  shop: string;

  backofficeApp: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
  };

  apis: {
    slug: SupportedShopifyApiSlugs;
    versions: ShopifyApiVersion[];
  }[];
}

export const shopifyConfig: ShopifyConfig = {
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
  apis: [
    {
      // https://shopify.dev/docs/api/admin-graphql
      slug: 'admin',
      versions: getSupportedShopifyAdminApiVersions(new Date()),
    },
  ],
};
