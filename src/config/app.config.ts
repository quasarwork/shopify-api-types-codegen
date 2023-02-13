import { get } from 'env-var';

import '@libs/utils/dotenv.lib';

export const appConfig = {
  outDir: get('OUT_DIR').required().asString(),
};
