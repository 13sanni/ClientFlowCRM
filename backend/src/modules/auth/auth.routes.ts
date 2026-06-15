import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { validateBody } from '../../middleware/validate.middleware.js'
import * as authController from './auth.controller.js'
import { refreshTokenSchema, signInSchema, signUpSchema } from './auth.schemas.js'

const router = Router()

// Stricter rate limit for auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later' },
})

router.post('/sign-up', authLimiter, validateBody(signUpSchema), authController.signUp)
router.post('/sign-in', authLimiter, validateBody(signInSchema), authController.signIn)
router.post('/refresh', validateBody(refreshTokenSchema), authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', requireAuth, authController.me)

export default router
