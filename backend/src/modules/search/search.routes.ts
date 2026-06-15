import { Router } from 'express'
import { search } from './search.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireWorkspaceSalesRep(), search)

export default router
