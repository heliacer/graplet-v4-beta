import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Resend from 'next-auth/providers/resend'
import type { DefaultSession } from 'next-auth'
import { getUser } from './app/lib/data/op'
import { signInSchema } from './app/lib/data/zod'
import { compare } from 'bcrypt'
import { GrapletAdapter } from './app/lib/data/adapter'
import { hash } from 'crypto'

const Allowlist = [
  'link.grob@outlook.de',
  'indominustobler@gmail.com',
  'francisco.engler@gmx.ch',
  'malamalazz169@gmail.com',
  'saykatorvideos@gmail.com',
  'heliacer@gmx.ch',
  'ameerkhalid193@gmail.com',
  'bobisbilly.3115@gmail.com',
  'thobias.larsen@proton.me'
]

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

  const valid = await compare(password, user.passwordHash)
  /** Passwords don't match */
  if (!valid) return null

  return user
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: GrapletAdapter(),
  session: {
    strategy: 'jwt'
  },
  pages: {
    verifyRequest: '/'
  },
  providers: [
    Resend({ from: 'noreply@heliacer.ch' }),
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
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
        const result = signInSchema.safeParse(credentials)
        if (!result.success) return null

        const { identifier, password } = result.data
        return await validateUser(identifier, password)
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },

    session({ session, token }) {
      session.user.emailHash = hash('sha-256', session.user.email!)
      session.user.id = token.id as string

      return session
    },

    async signIn({ user }) {
      if (!user.email) return false

      return Allowlist.includes(user.email.toLowerCase())
    }
  }
})
