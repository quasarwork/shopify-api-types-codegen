import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getReleaseCandidateShopifyAdminApiVersionCode,
  getSupportedShopifyAdminApiVersionCodes,
  getSupportedShopifyAdminApiVersions,
} from './get-shopify-admin-api-versions';

describe('Get release candidate Shopify Admin API Version code', () => {
  it('should return the appropriate release version based on the current date', () => {
    const testCases = [
      {
        currentDate: new Date('2023-03-20'),
        expectedVersionCode: '2023-04',
      },
      {
        currentDate: new Date('2023-09-20'),
        expectedVersionCode: '2023-10',
      },
      {
        currentDate: new Date('2023-11-20'),
        expectedVersionCode: '2024-01',
      },
    ];

    testCases.forEach(({ currentDate, expectedVersionCode }) => {
      const releaseCandidateShopifyAdminApiVersion =
        getReleaseCandidateShopifyAdminApiVersionCode(currentDate);

      assert.strictEqual(
        releaseCandidateShopifyAdminApiVersion,
        expectedVersionCode,
      );
    });
  });
});

describe('Get supported Shopify Admin API Version codes', () => {
  /**
   * Shopify releases new versions every quarter. Also Shopify supports the versions on a yearly basis.
   * This means that with:
   * - the upcoming release of the new version (coming on the future quarter)
   * - the unstable version
   * - and the yearly supported quarter versions
   * Shopify support a total of 6 versions.
   */
  it('should return the appropriate supported version codes based on the current date', () => {
    const testCases = [
      {
        currentDate: new Date('2023-09-20'),
        expectedSupportedVersions: [
          '2023-10',
          '2023-07',
          '2023-04',
          '2023-01',
          '2022-10',
        ],
      },
      {
        currentDate: new Date('2023-01-20'),
        expectedSupportedVersions: [
          '2023-04',
          '2023-01',
          '2022-10',
          '2022-07',
          '2022-04',
        ],
      },
    ];

    testCases.forEach(({ currentDate, expectedSupportedVersions }) => {
      const supportedShopifyAdminApiVersionsCodes =
        getSupportedShopifyAdminApiVersionCodes(currentDate);

      assert.strictEqual(
        JSON.stringify(supportedShopifyAdminApiVersionsCodes),
        JSON.stringify(expectedSupportedVersions),
      );
    });
  });
});

describe('Get supported Shopify Admin API Versions', () => {
  it('should return the appropriate supported versions based on the current date (with `unstable`, as well as `release_candidate`, and `latest` aliases)', () => {
    const testCases = [
      {
        currentDate: new Date('2023-09-20'),
        expectedSupportedVersions: [
          {
            name: 'October23',
            code: '2023-10',
          },
          {
            name: 'July23',
            code: '2023-07',
          },
          {
            name: 'April23',
            code: '2023-04',
          },
          {
            name: 'January23',
            code: '2023-01',
          },
          {
            name: 'October22',
            code: '2022-10',
          },
          {
            name: 'release_candidate',
            code: '2023-10',
          },
          {
            name: 'latest',
            code: '2023-07',
          },
          {
            name: 'unstable',
            code: 'unstable',
          },
        ],
      },
    ];

    testCases.forEach(({ currentDate, expectedSupportedVersions }) => {
      const supportedShopifyAdminApiVersionsCodes =
        getSupportedShopifyAdminApiVersions(currentDate);

      assert.strictEqual(
        JSON.stringify(supportedShopifyAdminApiVersionsCodes),
        JSON.stringify(expectedSupportedVersions),
      );
    });
  });
});
