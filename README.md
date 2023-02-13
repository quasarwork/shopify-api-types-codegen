# Shopify API Types codegen

## Installation

```
# You can use your preferred Node package manager
yarn install
```

You will need to create a development store on your Shopify Partner dashboard, then create a custom app from your store backoffice with every scopes granted.

Then copy and paste your custom app credentials in the `.env` file.

You will also need to specify the output directory in which you want your types to be generated.

## Usage

The supported Shopify APIs and API versions are defined here:
[`src/config/shopify.config.ts`](src/config/shopify.config.ts).

`release_candidate` and `latest` need to be mapped to another existing version to work properly e.g. `April23`.

`yarn build` will trigger the function defined here:
[`src/codegen/codegen.service.ts`](src/codegen/codegen.service.ts).

It will:

- Use `@graphql-codegen/cli` to fetch the GraphQL schema from Shopify for each api version.
- Populate a directory containg our manually defined types for [`@shopify/shopify-api`](https://github.com/Shopify/shopify-api-js) graphql client wich can be found here: [`src/shared/types/utils/shopify-api/index.types.ts`](src/shared/types/utils/shopify-api/index.types.ts)
- Map `release_candidate` and `latest` to the appropriate generated types definitions.
