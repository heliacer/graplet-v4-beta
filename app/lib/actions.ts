'use server'

import { signUpSchema } from './zod'
import { createUser } from './data'

interface AuthError {
  success: false
  message: string
}

type AuthResponse = { success: true } | AuthError

export async function credentialsSignUp(
  email: string,
  name: string,
  password?: string
): Promise<AuthResponse> {
  const result = signUpSchema.safeParse({ email, name, password })

  if (result.success) {
    try {
      await createUser(email, name, password)
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Something went wrong.' }
    }
  } else {
    return { success: false, message: 'Invalid credentials.' }
  }
}
