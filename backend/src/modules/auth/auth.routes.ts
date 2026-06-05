import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { validateBody } from '../../middleware/validate.middleware.js'
import * as authController from './auth.controller.js'
import { refreshTokenSchema, signInSchema, signUpSchema } from './auth.schemas.js'

const router = Router()

router.post('/sign-up', validateBody(signUpSchema), authController.signUp)
router.post('/sign-in', validateBody(signInSchema), authController.signIn)
router.post('/refresh', validateBody(refreshTokenSchema), authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', requireAuth, authController.me)

export default router
