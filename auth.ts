import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUser } from './app/lib/data/op'
import { signInSchema } from './app/lib/data/zod'
import { compare } from 'bcrypt'

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
          const user = validateUser(identifier, password)
          if (!user) throw Error('Invalid credentials.')
          return user
        }

        return null
      }
    })
  ]
})
