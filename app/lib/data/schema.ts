import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from '@auth/core/adapters'

export const usersTable = pgTable('user', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text().notNull().unique(),
  name: text(),
  passwordHash: text(),
  emailVerified: timestamp(),
  image: text(),
  createdAt: timestamp().notNull().defaultNow()
})

export const accountsTable = pgTable(
  'account',
  {
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text()
  },
  account => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId]
      })
    }
  ]
)

export const verificationTokensTable = pgTable(
  'verificationToken',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: 'date' }).notNull()
  },
  verificationToken => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token]
      })
    }
  ]
)

export const authenticatorsTable = pgTable(
  'authenticator',
  {
    credentialID: text().notNull().unique(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    providerAccountId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: text()
  },
  authenticator => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID]
      })
    }
  ]
)
