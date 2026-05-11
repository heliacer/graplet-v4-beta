import { compare } from 'bcrypt'
import NextAuth, { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { CredentialsSignin } from 'next-auth'
import { credentialsSchema } from './app/lib/zod'
import { getUserByEmail } from './app/lib/data'

class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials'
}

class UserNotFoundError extends CredentialsSignin {
  code = 'user_not_found'
}

class IncorrectPasswordError extends CredentialsSignin {
  code = 'incorrect_password'
}

interface SessionUser extends User {
  createdAt: Date
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }
}

function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) delete result[key]
  return result
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        const parsedCredentials = credentialsSchema.safeParse(credentials)
        if (!parsedCredentials.success) {
          throw new InvalidCredentialsError()
        }

        const { email, password } = parsedCredentials.data
        const user = await getUserByEmail(email)

        if (!user) {
          throw new UserNotFoundError()
        }

        const passwordsMatch = await compare(password, user.password)
        if (!passwordsMatch) {
          throw new IncorrectPasswordError()
        }

        return omit(user, 'password')
      }
    })
  ],
  callbacks: {
    jwt({ token }) {
      return token
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user
      }
      return session
    }
  }
})
