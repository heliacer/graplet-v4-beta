'use server'

import { credentialsSchema, emailSchema } from './zod'
import { createUser, getUserByEmail } from './data'
import { UserT } from './types'

interface AuthResponse {
  message: string
  status: 'ok' | 'error'
}

export async function checkEmail(email: string): Promise<AuthResponse> {
  const result = emailSchema.safeParse(email)
  if (result.error) {
    return { status: 'error', message: 'Invalid credentials.' }
  }

  try {
    const user = await getUserByEmail(email)
    if (user) {
      return { status: 'ok', message: 'continue' }
    } else {
      return { status: 'error', message: 'Early Access Only.' }
      // later: { status: 'ok', message: '' } (will redirect to /signup)
    }
  } catch (error) {
    console.log(error)
    return { status: 'error', message: 'Something went wrong.' }
  }
}

export async function signUp(data: Omit<UserT, 'id'>): Promise<AuthResponse> {
  const result = credentialsSchema.safeParse(data)
  if (result.error) {
    return { status: 'error', message: 'Invalid Credentials.' }
  }
  try {
    await createUser(data)
    return { status: 'ok', message: 'Success.' }
  } catch (error) {
    console.log(error)
    return { status: 'error', message: 'Something went wrong.' }
  }
}