import { join } from 'path';
import { appConfig } from '@config/app.config';
import { existsSync, mkdirSync } from 'fs';
import { copySync } from 'fs-extra';

/**
 * It adds a folder containing some manually added types that extends pre-defined types
 * of @shopify/shopify-api package.
 * @returns {void}
 */
export const generateShopifyApiUtilsTypes = () => {
  const { outDir } = appConfig;

  const shopifyApiUtilsSourceDir = join(
    __dirname,
    '../../shared/types/packaged',
  );

  const shopifyApiUtilsDestinationDir = join(__dirname, `../../../${outDir}`);

  if (!existsSync(shopifyApiUtilsDestinationDir))
    mkdirSync(shopifyApiUtilsDestinationDir, { recursive: true });

  copySync(shopifyApiUtilsSourceDir, shopifyApiUtilsDestinationDir);
};
