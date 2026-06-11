import { z } from 'zod'

export const listActivityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  action: z.string().trim().optional(),
  entityType: z.string().trim().optional(),
  entityId: z.string().trim().optional(),
  actorId: z.string().trim().optional(),
  clientId: z.string().trim().optional(),
  dealId: z.string().trim().optional(),
  taskId: z.string().trim().optional(),
  invoiceId: z.string().trim().optional(),
})

export type ListActivityQuery = z.infer<typeof listActivityQuerySchema>
