import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../utils/http-error.js'
import type {
  CreateDealInput,
  ListDealsQuery,
  MoveDealStageInput,
  UpdateDealInput,
} from './deal.schemas.js'

const dealInclude = {
  client: {
    select: {
      id: true,
      name: true,
      segment: true,
      status: true,
    },
  },
  stage: {
    select: {
      id: true,
      name: true,
      position: true,
      probability: true,
    },
  },
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  _count: {
    select: {
      tasks: true,
      files: true,
      activities: true,
    },
  },
} satisfies Prisma.DealInclude

function buildDealWhere(workspaceId: string, query: ListDealsQuery): Prisma.DealWhereInput {
  return {
    workspaceId,
    status: query.status,
    stageId: query.stageId,
    ownerId: query.ownerId,
    clientId: query.clientId,
    OR: query.search
      ? [
          { title: { contains: query.search, mode: 'insensitive' } },
          { client: { name: { contains: query.search, mode: 'insensitive' } } },
          { owner: { name: { contains: query.search, mode: 'insensitive' } } },
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

async function assertStageInWorkspace(workspaceId: string, stageId?: string) {
  if (!stageId) {
    return
  }

  const stage = await prisma.pipelineStage.findFirst({
    where: { id: stageId, workspaceId },
    select: { id: true, name: true },
  })

  if (!stage) {
    throw new HttpError(400, 'Pipeline stage must belong to this workspace')
  }

  return stage
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

export async function listPipelineStages(workspaceId: string) {
  return prisma.pipelineStage.findMany({
    where: { workspaceId },
    orderBy: { position: 'asc' },
  })
}

export async function listDeals(workspaceId: string, query: ListDealsQuery) {
  const where = buildDealWhere(workspaceId, query)
  const skip = (query.page - 1) * query.pageSize

  const [items, total] = await prisma.$transaction([
    prisma.deal.findMany({
      where,
      include: dealInclude,
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      skip,
      take: query.pageSize,
    }),
    prisma.deal.count({ where }),
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

export async function getDeal(workspaceId: string, dealId: string) {
  const deal = await prisma.deal.findFirst({
    where: { id: dealId, workspaceId },
    include: {
      ...dealInclude,
      tasks: {
        orderBy: { dueDate: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          metadata: true,
          createdAt: true,
        },
      },
    },
  })

  if (!deal) {
    throw new HttpError(404, 'Deal not found')
  }

  return deal
}

export async function createDeal(workspaceId: string, input: CreateDealInput) {
  await Promise.all([
    assertClientInWorkspace(workspaceId, input.clientId),
    assertStageInWorkspace(workspaceId, input.stageId),
    assertOwnerInWorkspace(workspaceId, input.ownerId),
  ])

  return prisma.deal.create({
    data: {
      title: input.title,
      value: input.value,
      status: input.status,
      closeDate: input.closeDate,
      clientId: input.clientId,
      stageId: input.stageId,
      ownerId: input.ownerId,
      workspaceId,
    },
    include: dealInclude,
  })
}

export async function updateDeal(workspaceId: string, dealId: string, input: UpdateDealInput) {
  await getDeal(workspaceId, dealId)

  await Promise.all([
    assertClientInWorkspace(workspaceId, input.clientId),
    assertStageInWorkspace(workspaceId, input.stageId),
    assertOwnerInWorkspace(workspaceId, input.ownerId),
  ])

  return prisma.deal.update({
    where: { id: dealId },
    data: {
      title: input.title,
      value: input.value,
      status: input.status,
      closeDate: input.closeDate,
      clientId: input.clientId,
      stageId: input.stageId,
      ownerId: input.ownerId,
    },
    include: dealInclude,
  })
}

export async function moveDealStage(
  workspaceId: string,
  dealId: string,
  actorId: string,
  input: MoveDealStageInput,
) {
  const deal = await getDeal(workspaceId, dealId)
  const nextStage = await assertStageInWorkspace(workspaceId, input.stageId)

  if (!nextStage) {
    throw new HttpError(400, 'Pipeline stage must belong to this workspace')
  }

  return prisma.$transaction(async (tx) => {
    const updatedDeal = await tx.deal.update({
      where: { id: dealId },
      data: { stageId: input.stageId },
      include: dealInclude,
    })

    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        dealId,
        clientId: deal.client.id,
        action: 'DEAL_STAGE_CHANGED',
        entityType: 'Deal',
        entityId: dealId,
        metadata: {
          from: deal.stage.name,
          to: nextStage.name,
        },
      },
    })

    return updatedDeal
  })
}

export async function deleteDeal(workspaceId: string, dealId: string) {
  await getDeal(workspaceId, dealId)

  await prisma.deal.delete({
    where: { id: dealId },
  })
}
