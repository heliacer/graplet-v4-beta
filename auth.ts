import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { DefaultSession } from 'next-auth'
import { getUser } from './app/lib/data/op'
import { signInSchema } from './app/lib/data/zod'
import { compare } from 'bcrypt'
import { GrapletAdapter } from './app/lib/data/adapter'
import { hash } from 'crypto'

declare module 'next-auth' {
  interface Session {
    user: {
      emailHash: string
    } & DefaultSession['user']
  }
}

async function validateUser(identifier: string, password: string) {
  const user = await getUser(identifier)
  /** User not found */
  if (!user) return null
  /** No password registered */
  if (!user.passwordHash) return null

  const valid = compare(password, user.passwordHash)
  /** Passwords don't match */
  if (!valid) return null

  return user
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: GrapletAdapter(),
  session: {
    strategy: 'jwt'
  },
  providers: [
    Credentials({
      credentials: {
        identifier: {
          label: 'Username or Email'
        },
        password: {
          type: 'password',
          label: 'Password'
        }
      },
      authorize: async credentials => {
        const parse = signInSchema.safeParse(credentials)

        if (parse.success) {
          const { identifier, password } = parse.data
          const user = await validateUser(identifier, password)
          if (!user) throw Error('Invalid credentials.')
          return user
        }

        return null
      }
    })
  ],
  callbacks: {
    session({ session, token }) {
      session.user.emailHash = hash('sha-256', session.user.email)
      session.user.id = token.id as string

      return session
    }
  }
})
