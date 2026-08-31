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

export async function signInAction(state: AuthResponse, formData: FormData) {
  const action = formData.get('action')
  if (action === 'credentials') return await credentialsSignIn(state, formData)
  if (action === 'resend') return await resendSignIn(state, formData)
  throw Error(`unknown action: "${action}"`)
}

export async function credentialsSignIn(
  _state: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  try {
    await signIn('credentials', formData, { redirectTo: '/editor' })
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

export async function resendSignIn(
  _state: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const identifier = formData.get('identifier')

  if (typeof identifier !== 'string' || !identifier) {
    return { success: false, message: 'Please enter your email.' }
  }

  try {
    await signIn('resend', { email: identifier, redirectTo: '/editor' })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: ERROR_MSG }
    }
    throw error
  }
}
