import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { appConfig } from '@config/app.config';
import { ShopifyConfigApi } from '@config/shopify.config';

/**
 * Since some api keys are not fetchable as is from Shopify
 * (e.g. `release_candidate`, `latest`)
 * but we want to be able to import our types from it
 * (e.g. `import { SomeObject } from '@quasarwork/shopify-api-types/admin/api/latest'`)
 * we will create sort of aliases dir exports.
 * @returns {void}
 */
export const generateUnfetchableApiAliasesTypes = (
  api: ShopifyConfigApi,
  unfetchableApiAliases: string[],
) => {
  const { outDir } = appConfig;

  // Loop in supported apis
  for (const apiVersion of api.versions) {
    // Ignore fetchable api slugs
    if (unfetchableApiAliases.indexOf(apiVersion.name) === -1) continue;

    const typesDestinationDir = join(
      __dirname,
      `../../${outDir}/api/${api.slug}/${apiVersion.name}`,
    );

    if (!existsSync(typesDestinationDir))
      mkdirSync(typesDestinationDir, { recursive: true });

    const types = `export * from '../${apiVersion.code}';`;

    writeFileSync(`${typesDestinationDir}/index.ts`, types);
  }
};
