import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { getDashboardRevenue, getReportsSummary } from './analytics.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/dashboard/revenue', requireWorkspaceSalesRep(), getDashboardRevenue)
router.get('/reports/summary', requireWorkspaceSalesRep(), getReportsSummary)

export default router
