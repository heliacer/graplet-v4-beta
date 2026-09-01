'use server'

import { emailSchema, signUpSchema } from './zod'
import { createUser } from './op'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

interface AuthResponseError {
  success: false
  message: string
}

const ERROR_MSG = 'Something went wrong.'
const INVALID_MSG = 'Invalid credentials.'
const ACCESS_DENIED = 'Access denied, ask our discord to join.'

type AuthResponse = { success: true } | AuthResponseError

export async function credentialsSignUp(
  email: string,
  name: string,
  password?: string
): Promise<AuthResponse> {
  const result = signUpSchema.safeParse({ email, name, password })
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues.map(issue => issue.message).join(', ')
    }
  }

  try {
    await createUser(email, name, password)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: ERROR_MSG }
  }
}

export async function signInAction(
  state: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const action = formData.get('action')
  if (action === 'credentials' && !formData.get('password')) {
    return resendSignIn(state, formData)
  }

  if (action === 'credentials') return credentialsSignIn(state, formData)
  if (action === 'resend') return resendSignIn(state, formData)

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
  const email = formData.get('identifier')
  const result = emailSchema.safeParse(email)

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  try {
    await signIn('resend', { email: email, redirectTo: '/editor' })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'AccessDenied') {
        return { success: false, message: ACCESS_DENIED }
      }
      return { success: false, message: ERROR_MSG }
    }
    throw error
  }
}
