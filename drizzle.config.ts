import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID || '3ad4a9f5-77bd-4c1f-ad9c-bfd503a8997a',
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
