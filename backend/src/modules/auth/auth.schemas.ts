import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  workspaceName: z.string().trim().min(2).optional(),
})

export const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
