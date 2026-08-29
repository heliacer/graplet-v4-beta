'use server'

import { signUpSchema } from './zod'
import { createUser } from './op'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

interface AuthResponseError {
  success: false
  message: string
}

const ERROR_MSG = 'Something went wrong.'
const INVALID_MSG = 'Invalid credentials.'

type AuthResponse = { success: true } | AuthResponseError

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
      return { success: false, message: ERROR_MSG }
    }
  } else {
    return { success: false, message: INVALID_MSG }
  }
}

export async function credentialsSignIn(
  _state: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  try {
    await signIn('credentials', formData)
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { success: false, message: INVALID_MSG }
      }
      return { success: false, message: ERROR_MSG }
    }
    throw error
  }
}
