import { generateShopifyApiUtilsTypes } from '@codegen/utils/generate-shopify-api-utils-types';
import { generateUnfetchableApiAliasesTypes } from '@codegen/utils/generate-unfetchable-api-aliases-types';
import codegenApiAdmin from './api/admin/codegen.admin';

/**
 * It gathers our functions and runs them when called from CLI.
 */
const codegen = async (): Promise<void> => {
  await codegenApiAdmin();

  generateShopifyApiUtilsTypes();
};

export default codegen;
