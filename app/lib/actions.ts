'use server'

import { getUserByEmail } from './data'

export async function checkEmail(email: string): Promise<string> {
  if (email) {
    const user = await getUserByEmail(email)
    if (user) {
      return 'ok'
    } else {
      return 'invalid'
    }
  } else {
    return 'empty'
  }
}