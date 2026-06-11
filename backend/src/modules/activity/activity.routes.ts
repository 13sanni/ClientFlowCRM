import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { validateQuery } from '../../middleware/validate.middleware.js'
import * as activityController from './activity.controller.js'
import { listActivityQuerySchema } from './activity.schemas.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireWorkspaceSalesRep(),
  validateQuery(listActivityQuerySchema),
  activityController.listActivity,
)

export default router
