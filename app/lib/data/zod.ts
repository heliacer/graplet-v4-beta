import { z } from 'zod'

export const emailSchema = z.email('Invalid email.')

export const signInSchema = z.object({
  identifier: z.union([z.email(), z.string().min(3).max(30)]),
  password: z.string().min(8).max(32)
})

export const signUpSchema = z.object({
  email: emailSchema,
  name: z.string().min(3, 'Username must be at least 3 characters.').max(30),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(32, 'Password must be less than 32 characters.')
})
