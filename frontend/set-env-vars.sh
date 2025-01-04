echo "export const environment = {
  production: true,
  apiBaseUrl: '',
  salesTaxUrl: '$TAX_URL',
  ninjasApiKey: '$NINJAS_API_KEY'
};" > src/environment/environment.prod.ts

echo "/api/* https://bioarktech.com/api/:splat 200" > dist/frontend/browser/_redirects

touch src/environment/environment.ts