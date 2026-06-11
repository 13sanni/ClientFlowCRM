import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import type { ListActivityQuery } from './activity.schemas.js'

const activityInclude = {
  actor: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  client: {
    select: {
      id: true,
      name: true,
    },
  },
  deal: {
    select: {
      id: true,
      title: true,
    },
  },
  task: {
    select: {
      id: true,
      title: true,
    },
  },
  invoice: {
    select: {
      id: true,
      invoiceNo: true,
    },
  },
} satisfies Prisma.ActivityLogInclude

function buildActivityWhere(
  workspaceId: string,
  query: ListActivityQuery,
): Prisma.ActivityLogWhereInput {
  return {
    workspaceId,
    action: query.action,
    entityType: query.entityType,
    entityId: query.entityId,
    actorId: query.actorId,
    clientId: query.clientId,
    dealId: query.dealId,
    taskId: query.taskId,
    invoiceId: query.invoiceId,
  }
}

export async function listActivity(workspaceId: string, query: ListActivityQuery) {
  const where = buildActivityWhere(workspaceId, query)
  const skip = (query.page - 1) * query.pageSize

  const [items, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      include: activityInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.pageSize,
    }),
    prisma.activityLog.count({ where }),
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
