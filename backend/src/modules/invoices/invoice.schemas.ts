import { z } from 'zod'

const invoiceStatusSchema = z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'VOID'])

export const invoiceIdParamsSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice id is required'),
})

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: invoiceStatusSchema.optional(),
  clientId: z.string().trim().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  issuedFrom: z.coerce.date().optional(),
  issuedTo: z.coerce.date().optional(),
})

export const createInvoiceSchema = z.object({
  invoiceNo: z.string().trim().min(2, 'Invoice number must be at least 2 characters'),
  amount: z.coerce.number().min(0, 'Amount cannot be negative'),
  status: invoiceStatusSchema.default('DRAFT'),
  issuedAt: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional(),
  paidAt: z.coerce.date().optional(),
  clientId: z.string().trim().min(1, 'Client id is required'),
})

export const updateInvoiceSchema = createInvoiceSchema.partial()

export const updateInvoiceStatusSchema = z.object({
  status: invoiceStatusSchema,
  paidAt: z.coerce.date().optional(),
})

export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>
