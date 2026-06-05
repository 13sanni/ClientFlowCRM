import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceManager, requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.middleware.js'
import * as dealController from './deal.controller.js'
import {
  createDealSchema,
  dealIdParamsSchema,
  listDealsQuerySchema,
  moveDealStageSchema,
  updateDealSchema,
} from './deal.schemas.js'

const router = Router()

router.use(requireAuth)

router.get('/stages', requireWorkspaceSalesRep(), dealController.listStages)
router.get('/', requireWorkspaceSalesRep(), validateQuery(listDealsQuerySchema), dealController.listDeals)
router.post('/', requireWorkspaceSalesRep(), validateBody(createDealSchema), dealController.createDeal)
router.get(
  '/:dealId',
  requireWorkspaceSalesRep(),
  validateParams(dealIdParamsSchema),
  dealController.getDeal,
)
router.patch(
  '/:dealId',
  requireWorkspaceSalesRep(),
  validateParams(dealIdParamsSchema),
  validateBody(updateDealSchema),
  dealController.updateDeal,
)
router.patch(
  '/:dealId/stage',
  requireWorkspaceSalesRep(),
  validateParams(dealIdParamsSchema),
  validateBody(moveDealStageSchema),
  dealController.moveDealStage,
)
router.delete(
  '/:dealId',
  requireWorkspaceManager(),
  validateParams(dealIdParamsSchema),
  dealController.deleteDeal,
)

export default router
