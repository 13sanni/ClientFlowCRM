import { z } from 'zod'

const dealStatusSchema = z.enum(['OPEN', 'WON', 'LOST'])

export const dealIdParamsSchema = z.object({
  dealId: z.string().min(1, 'Deal id is required'),
})

export const listDealsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(1000).default(10),
  search: z.string().trim().optional(),
  status: dealStatusSchema.optional(),
  stageId: z.string().trim().optional(),
  ownerId: z.string().trim().optional(),
  clientId: z.string().trim().optional(),
})

export const createDealSchema = z.object({
  title: z.string().trim().min(2, 'Deal title must be at least 2 characters'),
  value: z.coerce.number().min(0).default(0),
  status: dealStatusSchema.default('OPEN'),
  closeDate: z.coerce.date().optional(),
  clientId: z.string().trim().min(1, 'Client id is required'),
  stageId: z.string().trim().min(1, 'Stage id is required'),
  ownerId: z.string().trim().optional(),
})

export const updateDealSchema = createDealSchema.partial()

export const moveDealStageSchema = z.object({
  stageId: z.string().trim().min(1, 'Stage id is required'),
})

export type ListDealsQuery = z.infer<typeof listDealsQuerySchema>
export type CreateDealInput = z.infer<typeof createDealSchema>
export type UpdateDealInput = z.infer<typeof updateDealSchema>
export type MoveDealStageInput = z.infer<typeof moveDealStageSchema>
