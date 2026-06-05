import { z } from 'zod'

const clientStatusSchema = z.enum(['LEAD', 'ACTIVE', 'AT_RISK', 'CHURNED'])

export const clientIdParamsSchema = z.object({
  clientId: z.string().min(1, 'Client id is required'),
})

export const listClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: clientStatusSchema.optional(),
  ownerId: z.string().trim().optional(),
  segment: z.string().trim().optional(),
})

export const createClientSchema = z.object({
  name: z.string().trim().min(2, 'Client name must be at least 2 characters'),
  segment: z.string().trim().optional(),
  status: clientStatusSchema.default('LEAD'),
  value: z.coerce.number().min(0).default(0),
  website: z.string().trim().url().optional(),
  notes: z.string().trim().optional(),
  ownerId: z.string().trim().optional(),
  primaryContact: z
    .object({
      name: z.string().trim().min(2),
      email: z.string().trim().email().optional(),
      phone: z.string().trim().optional(),
      title: z.string().trim().optional(),
    })
    .optional(),
})

export const updateClientSchema = createClientSchema.partial()

export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>
export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
