import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../utils/http-error.js'
import type {
  CreateInvoiceInput,
  ListInvoicesQuery,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
} from './invoice.schemas.js'

const invoiceInclude = {
  client: {
    select: {
      id: true,
      name: true,
      segment: true,
      status: true,
    },
  },
  _count: {
    select: {
      files: true,
      activities: true,
    },
  },
} satisfies Prisma.InvoiceInclude

function buildInvoiceWhere(
  workspaceId: string,
  query: ListInvoicesQuery,
): Prisma.InvoiceWhereInput {
  return {
    workspaceId,
    status: query.status,
    clientId: query.clientId,
    dueAt:
      query.dueFrom || query.dueTo
        ? {
            gte: query.dueFrom,
            lte: query.dueTo,
          }
        : undefined,
    issuedAt:
      query.issuedFrom || query.issuedTo
        ? {
            gte: query.issuedFrom,
            lte: query.issuedTo,
          }
        : undefined,
    OR: query.search
      ? [
          { invoiceNo: { contains: query.search, mode: 'insensitive' } },
          { client: { name: { contains: query.search, mode: 'insensitive' } } },
        ]
      : undefined,
  }
}

async function assertClientInWorkspace(workspaceId: string, clientId?: string) {
  if (!clientId) {
    return
  }

  const client = await prisma.client.findFirst({
    where: { id: clientId, workspaceId },
    select: { id: true },
  })

  if (!client) {
    throw new HttpError(400, 'Client must belong to this workspace')
  }
}

async function writeInvoiceActivity(data: {
  workspaceId: string
  actorId: string
  invoiceId: string
  clientId: string
  action: string
  metadata?: Prisma.InputJsonValue
}) {
  await prisma.activityLog.create({
    data: {
      workspaceId: data.workspaceId,
      actorId: data.actorId,
      invoiceId: data.invoiceId,
      clientId: data.clientId,
      action: data.action,
      entityType: 'Invoice',
      entityId: data.invoiceId,
      metadata: data.metadata,
    },
  })
}

export async function listInvoices(workspaceId: string, query: ListInvoicesQuery) {
  const where = buildInvoiceWhere(workspaceId, query)
  const skip = (query.page - 1) * query.pageSize

  const [items, total] = await prisma.$transaction([
    prisma.invoice.findMany({
      where,
      include: invoiceInclude,
      orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { updatedAt: 'desc' }],
      skip,
      take: query.pageSize,
    }),
    prisma.invoice.count({ where }),
  ])

  return {
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  }
}

export async function getInvoice(workspaceId: string, invoiceId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, workspaceId },
    include: {
      ...invoiceInclude,
      files: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          size: true,
          url: true,
          createdAt: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          action: true,
          metadata: true,
          createdAt: true,
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!invoice) {
    throw new HttpError(404, 'Invoice not found')
  }

  return invoice
}

export async function createInvoice(
  workspaceId: string,
  actorId: string,
  input: CreateInvoiceInput,
) {
  await assertClientInWorkspace(workspaceId, input.clientId)

  const existingInvoice = await prisma.invoice.findUnique({
    where: {
      workspaceId_invoiceNo: {
        workspaceId,
        invoiceNo: input.invoiceNo,
      },
    },
  })

  if (existingInvoice) {
    throw new HttpError(409, 'Invoice number already exists in this workspace')
  }

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        invoiceNo: input.invoiceNo,
        amount: input.amount,
        status: input.status,
        issuedAt: input.issuedAt,
        dueAt: input.dueAt,
        paidAt: input.status === 'PAID' ? input.paidAt || new Date() : input.paidAt,
        clientId: input.clientId,
        workspaceId,
      },
      include: invoiceInclude,
    })

    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        action: 'INVOICE_CREATED',
        entityType: 'Invoice',
        entityId: invoice.id,
        metadata: { invoiceNo: invoice.invoiceNo, amount: input.amount },
      },
    })

    return invoice
  })
}

export async function updateInvoice(
  workspaceId: string,
  invoiceId: string,
  actorId: string,
  input: UpdateInvoiceInput,
) {
  const currentInvoice = await getInvoice(workspaceId, invoiceId)
  await assertClientInWorkspace(workspaceId, input.clientId)

  if (input.invoiceNo && input.invoiceNo !== currentInvoice.invoiceNo) {
    const duplicate = await prisma.invoice.findUnique({
      where: {
        workspaceId_invoiceNo: {
          workspaceId,
          invoiceNo: input.invoiceNo,
        },
      },
    })

    if (duplicate) {
      throw new HttpError(409, 'Invoice number already exists in this workspace')
    }
  }

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        invoiceNo: input.invoiceNo,
        amount: input.amount,
        status: input.status,
        issuedAt: input.issuedAt,
        dueAt: input.dueAt,
        paidAt: input.status === 'PAID' ? input.paidAt || currentInvoice.paidAt || new Date() : input.paidAt,
        clientId: input.clientId,
      },
      include: invoiceInclude,
    })

    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        action: 'INVOICE_UPDATED',
        entityType: 'Invoice',
        entityId: invoice.id,
        metadata: { status: invoice.status, amount: input.amount },
      },
    })

    return invoice
  })
}

export async function updateInvoiceStatus(
  workspaceId: string,
  invoiceId: string,
  actorId: string,
  input: UpdateInvoiceStatusInput,
) {
  const currentInvoice = await getInvoice(workspaceId, invoiceId)

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        status: input.status,
        paidAt: input.status === 'PAID' ? input.paidAt || new Date() : null,
      },
      include: invoiceInclude,
    })

    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        action: 'INVOICE_STATUS_CHANGED',
        entityType: 'Invoice',
        entityId: invoice.id,
        metadata: { from: currentInvoice.status, to: invoice.status },
      },
    })

    return invoice
  })
}

export async function deleteInvoice(workspaceId: string, invoiceId: string, actorId: string) {
  const invoice = await getInvoice(workspaceId, invoiceId)

  await prisma.$transaction(async (tx) => {
    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        invoiceId,
        clientId: invoice.clientId,
        action: 'INVOICE_DELETED',
        entityType: 'Invoice',
        entityId: invoiceId,
        metadata: { invoiceNo: invoice.invoiceNo, amount: invoice.amount.toString() },
      },
    })

    await tx.invoice.delete({
      where: { id: invoiceId },
    })
  })
}
