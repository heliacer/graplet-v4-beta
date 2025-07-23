'use server'

import { getUserByEmail } from './data'

interface AuthResponse {
  message: string
  status: 'ok' | 'error'
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string): boolean {
  return Boolean(password && password.length >= 6)
}

// Error responses
const AUTH_ERROR = {
  EARLY_ACCESS_ONLY: { message: 'Early Access only.', status: 'error' as const },
  INTERNAL_ERROR: { message: 'Something went wrong.', status: 'error' as const },
  INVALID_INPUT: { message: 'Nice try Diddy.', status: 'error' as const },
  INVALID_INPUT_ADVANCED: { message: 'Nice try Super Diddy.', status: 'error' as const },
  INCORRECT_PASSWORD: { message: 'Incorrect password.', status: 'error' as const }
}

// Success responses
const AUTH_SUCCESS = {
  CONTINUE: { message: 'continue', status: 'ok' as const },
  AUTHORIZED: { message: 'authorized', status: 'ok' as const }
}

async function handleAuthOperation(
  operation: () => Promise<AuthResponse>,
  errorResponse: AuthResponse = AUTH_ERROR.INTERNAL_ERROR
): Promise<AuthResponse> {
  try {
    return await operation()
  } catch (error) {
    console.error(error)
    return errorResponse
  }
}


/*
  Progressive Login: 1 Field (Email), check which action to perform (login/signup*)  
  * in future, for now, Early Access only. 
*/

export async function checkEmail(email: string): Promise<AuthResponse> {
  if (!email || !isValidEmail(email)) {
    return AUTH_ERROR.INVALID_INPUT
  }

  return handleAuthOperation(async () => {
    const user = await getUserByEmail(email)
    
    if (user) {
      // Case 1: Proceed to login/password
      return AUTH_SUCCESS.CONTINUE
    } else {
      // Case 2a: Unauthorized. 
      return AUTH_ERROR.EARLY_ACCESS_ONLY

      /* Case 2b (future): Proceed to /signup
      return { message: '', status: 'ok' }
      */
    }
  })
}


// Login with password (login/password) once email has been checked

export async function logIn(email: string, password: string): Promise<AuthResponse> {
  if (!email || !isValidEmail(email) || !isValidPassword(password)) {
    return AUTH_ERROR.INVALID_INPUT_ADVANCED
  }

  return handleAuthOperation(async () => {
    const user = await getUserByEmail(email)
    
    if (user) {
      if (user.password === password) {
        // Case 1a: Proceed to /editor/ - (preview)
        return AUTH_SUCCESS.AUTHORIZED

        // Case 1b (future): Proceed to /mystuff/
      } else {
        // Case 2: Unauthorized.
        return AUTH_ERROR.INCORRECT_PASSWORD
      }
    } else {
      // Case 3a: Unauthorized. 
      return AUTH_ERROR.EARLY_ACCESS_ONLY

      /* Case 3b (future): Proceed to /signup
      return { message: '', status: 'ok' }
      */
    }
  })
}


export async function simulateCheck(email: string): Promise<AuthResponse> {
  console.log(email)
  // Testing
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(AUTH_SUCCESS.CONTINUE)
    }, 1000)
  })
}

export async function simulateLogIn(email: string, password: string): Promise<AuthResponse> {
  console.log(email,password)
  // Testing
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(AUTH_SUCCESS.AUTHORIZED)
    }, 1000)
  })
}
