import { z } from 'zod'

export const dashboardRevenueQuerySchema = z.object({
  range: z.enum(['Last 30 days', 'Last 6 months', 'Year to date']).default('Last 6 months'),
})

export const reportsRangeQuerySchema = z.object({
  range: z.enum(['This quarter', 'Last quarter', 'Year to date', 'Last 12 months']).default('This quarter'),
})

export type DashboardRevenueQuery = z.infer<typeof dashboardRevenueQuerySchema>
export type ReportsRangeQuery = z.infer<typeof reportsRangeQuerySchema>
