import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceManager, requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.middleware.js'
import * as clientController from './client.controller.js'
import {
  clientIdParamsSchema,
  createClientSchema,
  listClientsQuerySchema,
  updateClientSchema,
} from './client.schemas.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireWorkspaceSalesRep(),
  validateQuery(listClientsQuerySchema),
  clientController.listClients,
)
router.post(
  '/',
  requireWorkspaceSalesRep(),
  validateBody(createClientSchema),
  clientController.createClient,
)
router.get(
  '/:clientId',
  requireWorkspaceSalesRep(),
  validateParams(clientIdParamsSchema),
  clientController.getClient,
)
router.patch(
  '/:clientId',
  requireWorkspaceSalesRep(),
  validateParams(clientIdParamsSchema),
  validateBody(updateClientSchema),
  clientController.updateClient,
)
router.delete(
  '/:clientId',
  requireWorkspaceManager(),
  validateParams(clientIdParamsSchema),
  clientController.deleteClient,
)

export default router
