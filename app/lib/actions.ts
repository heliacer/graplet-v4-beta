'use server'

import { emailSchema } from './zod'
import { getUserByEmail } from './data'

interface AuthResponse {
  message: string
  status: 'ok' | 'error'
}

export async function checkEmail(email: string): Promise<AuthResponse> {
  const result = emailSchema.safeParse(email)
  if (result.error) {
    // User bypassed client checks
    return { status: 'error', message: 'Nice try Diddy.' }
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