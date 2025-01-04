cd frontend 

mkdir src/environment
touch src/environment/environment.prod.ts
touch src/environment/environment.ts

echo "export const environment = {
  production: true,
  apiBaseUrl: 'https://api.bioarktech.com',
  salesTaxUrl: '$TAX_URL',
  ninjasApiKey: '$NINJAS_API_KEY'
};" > src/environment/environment.prod.ts

npm install
npx ng build --configuration=production
