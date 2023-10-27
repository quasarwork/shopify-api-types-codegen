import { UNFETCHABLE_API_ALIASES, shopifyConfig } from '@config/shopify.config';
import { buildConfigThenGenerateApiTypesPaymentApps } from './utils/build-config-then-generate-shopify-api-types-payment-apps';
import { generateUnfetchableApiAliasesTypes } from '@codegen/utils/generate-unfetchable-api-aliases-types';

const { apis } = shopifyConfig;

const shopifyApiPaymentAppsConfig = apis.find(
  (api) => api.slug === 'payments_apps',
);

if (!shopifyApiPaymentAppsConfig)
  throw new Error('Shopify payments apps api config not found');

const codegenApiPaymentApps = async () => {
  await buildConfigThenGenerateApiTypesPaymentApps(
    shopifyApiPaymentAppsConfig,
    UNFETCHABLE_API_ALIASES,
  );

  generateUnfetchableApiAliasesTypes(
    shopifyApiPaymentAppsConfig,
    UNFETCHABLE_API_ALIASES,
  );
};

export default codegenApiPaymentApps;
