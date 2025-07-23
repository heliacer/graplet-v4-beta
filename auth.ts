import { compare } from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { CredentialsSignin } from "next-auth"
import { credentialsSchema } from "./app/lib/zod"
import { getUserByEmail } from "./app/lib/data"

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials"
}

class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found"
}

class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect_password"
}

declare module "next-auth" {
  interface User {
    id: string
    email: string
    password: string
    createdAt?: Date
  }
}

  export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    credentials: {
      email: {},
      password: {}
    },
    authorize: async (credentials) => {
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
      
      return user
    }
  })],
})