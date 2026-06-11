import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { getDashboardRevenue, getReportsSummary } from './analytics.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/dashboard/revenue', getDashboardRevenue)
router.get('/reports/summary', getReportsSummary)

export default router
