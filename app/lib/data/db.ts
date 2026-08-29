import { Pool } from '@neondatabase/serverless'
import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { relations } from './relations'

loadEnvConfig(process.cwd())

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
export const db = drizzle({ client: pool, relations })
