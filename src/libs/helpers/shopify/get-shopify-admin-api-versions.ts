import {
  MonthName,
  TwoDigitMonthNumber,
  YearNumber,
} from '@shared/types/dev/utils/date.types';
import {
  ShopifyApiVersion,
  ShopifyApiVersionCode,
  ShopifyApiVersionName,
} from '@shared/types/dev/shopify-custom.types';

export const QUARTER_MONTHS = [1, 4, 7, 10];

/**
 * @param currentMonth {number} - Month number with a range of 1-12
 */
export const getUpcomingQuarterMonth = (
  quarterMonths: number[],
  currentMonth: number,
): number => {
  quarterMonths = quarterMonths.sort((a, b) => a - b);

  const upcomingQuarterMonth = QUARTER_MONTHS.find(
    (quarterMonth) => quarterMonth > currentMonth,
  );

  return upcomingQuarterMonth ?? QUARTER_MONTHS[0];
};

export const buildTwoDigitMonthNumber = (month: number): TwoDigitMonthNumber =>
  month.toString().padStart(2, '0') as TwoDigitMonthNumber;

export const buildShopifyApiVersionCode = (
  year: YearNumber,
  month: TwoDigitMonthNumber,
): ShopifyApiVersionCode => `${year}-${month}` as ShopifyApiVersionCode;

/**
 * It gets the upcoming Shopify Admin API version code based on the current date.
 * This possible based on the fact that Shopify releases new versions every quarter.
 */
export const getReleaseCandidateShopifyAdminApiVersionCode = (
  currentDate: Date,
): ShopifyApiVersionCode => {
  const currentDateMonth = currentDate.getMonth() + 1;
  const upcomingQuarterMonth = getUpcomingQuarterMonth(
    QUARTER_MONTHS,
    currentDateMonth,
  );
  const upcomingQuarterTwoDigitMonth = upcomingQuarterMonth
    .toString()
    .padStart(2, '0') as TwoDigitMonthNumber;

  const upcomingQuarterYear = currentDateMonth >= 10 ? 2024 : 2023;

  const code = buildShopifyApiVersionCode(
    upcomingQuarterYear,
    upcomingQuarterTwoDigitMonth,
  );

  return code;
};

export const getPreviousShopifyAdminApiVersionCode = (
  quarterMonths: number[],
  versionCode: ShopifyApiVersionCode,
): ShopifyApiVersionCode => {
  quarterMonths = quarterMonths.sort((a, b) => a - b);
  const [year, month] = versionCode.split('-');

  const monthIndex = quarterMonths.indexOf(Number(month));
  const previousMonthIndex = monthIndex - 1 < 0 ? 3 : monthIndex - 1;
  const previousMonth = quarterMonths[previousMonthIndex];
  const previousYear =
    previousMonthIndex === 3 ? Number(year) - 1 : Number(year);

  const code = buildShopifyApiVersionCode(
    previousYear as YearNumber,
    buildTwoDigitMonthNumber(previousMonth),
  );

  return code;
};

export const getSupportedShopifyAdminApiVersionCodes = (
  currentDate: Date,
): ShopifyApiVersionCode[] => {
  const releaseCandidateShopifyAdminApiVersionCode =
    getReleaseCandidateShopifyAdminApiVersionCode(currentDate);

  let versions: ShopifyApiVersionCode[] = [
    releaseCandidateShopifyAdminApiVersionCode,
  ];

  for (let i = 0; i < 4; i++) {
    versions.push(
      getPreviousShopifyAdminApiVersionCode(
        QUARTER_MONTHS,
        versions[versions.length - 1],
      ),
    );
  }

  return versions;
};

export const getShopifyAdminApiVersionNameFromCode = (
  versionCode: ShopifyApiVersionCode,
): ShopifyApiVersionName => {
  const [year, month] = versionCode.split('-');

  const yearTwoDigitNumber = year.slice(2) as TwoDigitMonthNumber;
  const monthName = new Date(`${year}-${month}-01`).toLocaleString('en-US', {
    month: 'long',
  }) as MonthName;

  return `${monthName}${yearTwoDigitNumber}` as ShopifyApiVersionName;
};

export const getSupportedShopifyApiVersions = (
  currentDate: Date,
): ShopifyApiVersion[] => {
  let versions: ShopifyApiVersion[] = [];

  const versionCodes = getSupportedShopifyAdminApiVersionCodes(currentDate);

  versionCodes.forEach((versionCode) => {
    versions.push({
      name: getShopifyAdminApiVersionNameFromCode(versionCode),
      code: versionCode,
    });
  });

  // Add `release_candidate` and latest aliases
  versions.push({
    name: 'release_candidate',
    code: versionCodes[0],
  });

  versions.push({
    name: 'latest',
    code: versionCodes[1],
  });

  // Add `unstable` alias
  versions.push({
    name: 'unstable',
    code: 'unstable',
  });

  return versions;
};
