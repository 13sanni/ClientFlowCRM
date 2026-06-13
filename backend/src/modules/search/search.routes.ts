import { Router } from 'express'
import { search } from './search.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = Router()

router.use(requireAuth)

router.get('/', search)

export default router
