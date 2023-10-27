import { generateShopifyApiUtilsTypes } from '@codegen/utils/generate-shopify-api-utils-types';
import codegenApiAdmin from './api/admin/codegen.admin';
import codegenApiPaymentApps from './api/payment_apps/codegen.payment_apps';

/**
 * It gathers our functions and runs them when called from CLI.
 */
const codegen = async (): Promise<void> => {
  await codegenApiAdmin();
  await codegenApiPaymentApps();

  generateShopifyApiUtilsTypes();
};

export default codegen;
