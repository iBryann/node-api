git init
yarn init -y
yarn tsc --init
npx eslint --init

npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init