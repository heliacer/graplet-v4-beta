import { defineConfig } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const url = process.env.DATABASE_URL
if (url === undefined) throw Error('no env.DATABASE_URL')

export default defineConfig({
  out: './drizzle',
  schema: './app/lib/data/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url }
})
