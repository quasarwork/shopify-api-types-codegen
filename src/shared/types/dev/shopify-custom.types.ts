import { TwoDigitNumber } from '@shared/types/dev/utils/numeric.types';
import {
  MonthName,
  TwoDigitMonthNumber,
  YearNumber,
} from '@shared/types/dev/utils/date.types';

export type SupportedShopifyApiSlugs = 'admin' | 'payments_apps';

export type ShopifyApiVersionName =
  | `${MonthName}${TwoDigitNumber}`
  | 'release_candidate'
  | 'latest'
  | 'unstable';

export type ShopifyApiVersionCode =
  | `${YearNumber}-${TwoDigitMonthNumber}`
  | 'unstable';

export interface ShopifyApiVersion {
  name: ShopifyApiVersionName;
  code: ShopifyApiVersionCode;
}
