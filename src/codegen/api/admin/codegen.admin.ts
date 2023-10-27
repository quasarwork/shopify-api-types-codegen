import { UNFETCHABLE_API_ALIASES, shopifyConfig } from '@config/shopify.config';
import { buildConfigThenGenerateApiTypesDefault } from '@codegen/utils/build-config-then-generate-shopify-api-types-default';
import { generateUnfetchableApiAliasesTypes } from '@codegen/utils/generate-unfetchable-api-aliases-types';

const codegenApiAdmin = async () => {
  const { apis } = shopifyConfig;

  const shopifyApiAdminConfig = apis.find((api) => api.slug === 'admin');

  if (!shopifyApiAdminConfig)
    throw new Error('Shopify admin api config not found');

  await buildConfigThenGenerateApiTypesDefault(
    shopifyApiAdminConfig,
    UNFETCHABLE_API_ALIASES,
  );
  generateUnfetchableApiAliasesTypes(
    shopifyApiAdminConfig,
    UNFETCHABLE_API_ALIASES,
  );
};

export default codegenApiAdmin;
