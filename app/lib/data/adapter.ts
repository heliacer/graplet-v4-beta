import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterUser,
  VerificationToken
} from 'next-auth/adapters'
import { and, eq } from 'drizzle-orm'
import { db } from './db'
import {
  accountsTable,
  authenticatorsTable,
  usersTable,
  verificationTokensTable
} from './schema'

export function GrapletAdapter(): Adapter {
  return {
    /**
     * Users
     */

    async createUser(user) {
      const [created] = await db
        .insert(usersTable)
        .values({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        })
        .returning()

      return created as AdapterUser
    },

    async getUser(id) {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1)

      return user ? (user as AdapterUser) : null
    },

    async getUserByEmail(email) {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)

      return user ? (user as AdapterUser) : null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const [result] = await db
        .select({
          user: usersTable
        })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId)
          )
        )
        .limit(1)

      return result?.user ? (result.user as AdapterUser) : null
    },

    async updateUser(user) {
      const [updated] = await db
        .update(usersTable)
        .set(user)
        .where(eq(usersTable.id, user.id))
        .returning()

      return updated as AdapterUser
    },

    async deleteUser(id) {
      const [deleted] = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()

      return deleted ? (deleted as AdapterUser) : null
    },

    /**
     * Accounts
     */

    async linkAccount(account) {
      const [created] = await db
        .insert(accountsTable)
        .values(account)
        .returning()

      return created as AdapterAccount
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const [deleted] = await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId)
          )
        )
        .returning()

      return deleted as AdapterAccount | undefined
    },

    async getAccount(providerAccountId, provider) {
      const [account] = await db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId)
          )
        )
        .limit(1)

      return account ? (account as AdapterAccount) : null
    },

    /**
     * Magic-link verification tokens
     */

    async createVerificationToken(token) {
      const [created] = await db
        .insert(verificationTokensTable)
        .values(token)
        .returning()

      return created as VerificationToken
    },

    async useVerificationToken({ identifier, token }) {
      const [deleted] = await db
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, identifier),
            eq(verificationTokensTable.token, token)
          )
        )
        .returning()

      return deleted ? (deleted as VerificationToken) : null
    },

    /**
     * Webauthn / passkeys
     */

    async createAuthenticator(authenticator) {
      const [created] = await db
        .insert(authenticatorsTable)
        .values({
          credentialID: authenticator.credentialID,
          userId: authenticator.userId,
          providerAccountId: authenticator.providerAccountId,
          credentialPublicKey: authenticator.credentialPublicKey,
          counter: authenticator.counter,
          credentialDeviceType: authenticator.credentialDeviceType,
          credentialBackedUp: authenticator.credentialBackedUp,
          transports: authenticator.transports
        })
        .returning()

      return created as AdapterAuthenticator
    },

    async getAuthenticator(credentialID) {
      const [authenticator] = await db
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .limit(1)

      return authenticator ? (authenticator as AdapterAuthenticator) : null
    },

    async listAuthenticatorsByUserId(userId) {
      const authenticators = await db
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))

      return authenticators as AdapterAuthenticator[]
    },

    async updateAuthenticatorCounter(credentialID, counter) {
      const [updated] = await db
        .update(authenticatorsTable)
        .set({ counter })
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .returning()

      return updated as AdapterAuthenticator
    }
  }
}
