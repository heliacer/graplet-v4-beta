'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { createUser, deleteUser } from './op'
import { emailSchema, signUpSchema } from './zod'

type Response = { success: true } | { success: false; message: string }

const ERROR_MSG = 'Something went wrong.'
const INVALID_MSG = 'Invalid credentials.'
const ACCESS_DENIED = 'Access denied, ask our discord to join.'

export async function signInAction(
  _state: Response,
  formData: FormData
): Promise<Response> {
  const action = formData.get('action')

  if (action === 'credentials') {
    if (!formData.get('password')) return resendSignIn(formData)
    return credentialsSignIn(formData)
  }

  if (action === 'resend') return resendSignIn(formData)

  throw new Error(`Unknown sign-in action: ${action}`)
}

async function credentialsSignIn(formData: FormData): Promise<Response> {
  try {
    await signIn('credentials', formData, { redirectTo: '/editor' })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.type === 'CredentialsSignin' ? INVALID_MSG : ERROR_MSG
      }
    }

    throw error
  }
}

async function resendSignIn(formData: FormData): Promise<Response> {
  const result = emailSchema.safeParse(formData.get('identifier'))

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  try {
    await signIn('resend', { email: result.data, redirectTo: '/editor' })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.type === 'AccessDenied' ? ACCESS_DENIED : ERROR_MSG
      }
    }

    throw error
  }
}

export async function credentialsSignUp(
  email: string,
  name: string,
  password?: string
): Promise<Response> {
  const result = signUpSchema.safeParse({ email, name, password })

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues.map(i => i.message).join(', ')
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

export async function accountDelete(id: string): Promise<Response> {
  try {
    await deleteUser(id)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: ERROR_MSG }
  }
}
