import { z } from 'zod'

export const emailSchema = z.email()
export const passwordSchema = z.string().min(6)

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})
