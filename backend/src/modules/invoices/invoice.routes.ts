import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceManager, requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.middleware.js'
import * as invoiceController from './invoice.controller.js'
import {
  createInvoiceSchema,
  invoiceIdParamsSchema,
  listInvoicesQuerySchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from './invoice.schemas.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireWorkspaceSalesRep(),
  validateQuery(listInvoicesQuerySchema),
  invoiceController.listInvoices,
)
router.post(
  '/',
  requireWorkspaceSalesRep(),
  validateBody(createInvoiceSchema),
  invoiceController.createInvoice,
)
router.get(
  '/:invoiceId',
  requireWorkspaceSalesRep(),
  validateParams(invoiceIdParamsSchema),
  invoiceController.getInvoice,
)
router.patch(
  '/:invoiceId',
  requireWorkspaceSalesRep(),
  validateParams(invoiceIdParamsSchema),
  validateBody(updateInvoiceSchema),
  invoiceController.updateInvoice,
)
router.patch(
  '/:invoiceId/status',
  requireWorkspaceSalesRep(),
  validateParams(invoiceIdParamsSchema),
  validateBody(updateInvoiceStatusSchema),
  invoiceController.updateInvoiceStatus,
)
router.delete(
  '/:invoiceId',
  requireWorkspaceManager(),
  validateParams(invoiceIdParamsSchema),
  invoiceController.deleteInvoice,
)

export default router
