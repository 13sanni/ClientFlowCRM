import type { Request, Response, NextFunction } from 'express'
import { analyticsService } from './analytics.service.js'
import { dashboardRevenueQuerySchema, reportsRangeQuerySchema } from './analytics.schemas.js'
import { HttpError } from '../../utils/http-error.js'

export const getDashboardRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.workspaceId) {
      throw new HttpError(403, 'Workspace context required')
    }
    const { range } = dashboardRevenueQuerySchema.parse(req.query)
    const data = await analyticsService.getDashboardRevenue(req.auth.workspaceId, range)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const getReportsSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.workspaceId) {
      throw new HttpError(403, 'Workspace context required')
    }
    const { range } = reportsRangeQuerySchema.parse(req.query)
    const data = await analyticsService.getReportsSummary(req.auth.workspaceId, range)
    res.json(data)
  } catch (error) {
    next(error)
  }
}
