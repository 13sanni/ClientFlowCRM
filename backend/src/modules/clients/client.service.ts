import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../utils/http-error.js'
import type { CreateClientInput, ListClientsQuery, UpdateClientInput } from './client.schemas.js'

const clientInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  contacts: {
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      title: true,
      isPrimary: true,
    },
  },
  _count: {
    select: {
      deals: true,
      tasks: true,
      invoices: true,
    },
  },
} satisfies Prisma.ClientInclude

function buildClientWhere(workspaceId: string, query: ListClientsQuery): Prisma.ClientWhereInput {
  return {
    workspaceId,
    status: query.status,
    ownerId: query.ownerId,
    segment: query.segment,
    OR: query.search
      ? [
          { name: { contains: query.search, mode: 'insensitive' } },
          { segment: { contains: query.search, mode: 'insensitive' } },
          { contacts: { some: { name: { contains: query.search, mode: 'insensitive' } } } },
          { contacts: { some: { email: { contains: query.search, mode: 'insensitive' } } } },
        ]
      : undefined,
  }
}

async function assertOwnerInWorkspace(workspaceId: string, ownerId?: string) {
  if (!ownerId) {
    return
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: ownerId,
        workspaceId,
      },
    },
    select: { id: true },
  })

  if (!member) {
    throw new HttpError(400, 'Owner must be a member of this workspace')
  }
}

export async function listClients(workspaceId: string, query: ListClientsQuery) {
  const where = buildClientWhere(workspaceId, query)
  const skip = (query.page - 1) * query.pageSize

  const [items, total] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      include: clientInclude,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: query.pageSize,
    }),
    prisma.client.count({ where }),
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

export async function getClient(workspaceId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId,
    },
    include: {
      ...clientInclude,
      deals: {
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          value: true,
          status: true,
          closeDate: true,
          stage: { select: { id: true, name: true } },
        },
      },
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          invoiceNo: true,
          amount: true,
          status: true,
          dueAt: true,
        },
      },
    },
  })

  if (!client) {
    throw new HttpError(404, 'Client not found')
  }

  return client
}

export async function createClient(workspaceId: string, input: CreateClientInput) {
  await assertOwnerInWorkspace(workspaceId, input.ownerId)

  return prisma.client.create({
    data: {
      name: input.name,
      segment: input.segment,
      status: input.status,
      value: input.value,
      website: input.website,
      notes: input.notes,
      ownerId: input.ownerId,
      workspaceId,
      contacts: input.primaryContact
        ? {
            create: {
              ...input.primaryContact,
              isPrimary: true,
            },
          }
        : undefined,
    },
    include: clientInclude,
  })
}

export async function updateClient(workspaceId: string, clientId: string, input: UpdateClientInput) {
  await getClient(workspaceId, clientId)
  await assertOwnerInWorkspace(workspaceId, input.ownerId)

  return prisma.client.update({
    where: { id: clientId },
    data: {
      name: input.name,
      segment: input.segment,
      status: input.status,
      value: input.value,
      website: input.website,
      notes: input.notes,
      ownerId: input.ownerId,
    },
    include: clientInclude,
  })
}

export async function deleteClient(workspaceId: string, clientId: string) {
  await getClient(workspaceId, clientId)

  await prisma.client.delete({
    where: { id: clientId },
  })
}
