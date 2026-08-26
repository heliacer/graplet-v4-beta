import { z } from 'zod'

export const emailSchema = z.email()
export const passwordSchema = z.string().min(6)

export const signInSchema = z.object({
  identifier: z.union([
    z.email('Invalid email'),
    z.string().min(3, 'Username must be at least 3 characters').max(30)
  ]),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters')
})

export const signUpSchema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters')
})
