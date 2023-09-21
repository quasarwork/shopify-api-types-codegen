import { get } from 'env-var';

import '@libs/utils/dotenv.lib';
import { getSupportedShopifyApiVersions } from '@libs/helpers/shopify/get-shopify-admin-api-versions';
import {
  ShopifyApiVersion,
  SupportedShopifyApiSlugs,
} from '@shared/types/dev/shopify-custom.types';

export interface ShopifyConfigApi {
  slug: SupportedShopifyApiSlugs;
  versions: ShopifyApiVersion[];
}

export interface ShopifyConfig {
  shop: string;

  backofficeApp: {
    accessToken: string;
  };

  paymentApps: {
    shop: string;
    accessToken: string;
  };

  apis: ShopifyConfigApi[];
}

// These keys are specified in config file but are not fetchable "as is" from Shopify
export const UNFETCHABLE_API_ALIASES = ['release_candidate', 'latest'];

export const shopifyConfig: ShopifyConfig = {
  shop: get('SHOP').required().asString(),

  // Shopify credentials from backoffice generated app
  backofficeApp: {
    accessToken: get('SHOPIFY_BACKOFFICE_APP_ACCESS_TOKEN')
      .required()
      .asString(),
  },

  paymentApps: {
    shop: get('PAYMENT_APPS_SHOP').required().asString(),
    accessToken: get('PAYMENT_APPS_APP_ACCESS_TOKEN').required().asString(),
  },

  // Supported apis
  apis: [
    {
      // https://shopify.dev/docs/api/admin-graphql
      slug: 'admin',
      versions: getSupportedShopifyApiVersions(new Date()),
    },

    {
      // https://shopify.dev/docs/api/payments-apps
      slug: 'payments_apps',
      versions: getSupportedShopifyApiVersions(new Date()),
    },
  ],
};
