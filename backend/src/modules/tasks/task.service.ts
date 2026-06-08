import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../utils/http-error.js'
import type {
  AssignTaskInput,
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from './task.schemas.js'

const taskInclude = {
  client: {
    select: {
      id: true,
      name: true,
      segment: true,
    },
  },
  deal: {
    select: {
      id: true,
      title: true,
      value: true,
      status: true,
      stage: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.TaskInclude

function buildTaskWhere(workspaceId: string, query: ListTasksQuery): Prisma.TaskWhereInput {
  return {
    workspaceId,
    status: query.status,
    priority: query.priority,
    assigneeId: query.assigneeId,
    clientId: query.clientId,
    dealId: query.dealId,
    dueDate:
      query.dueFrom || query.dueTo
        ? {
            gte: query.dueFrom,
            lte: query.dueTo,
          }
        : undefined,
    OR: query.search
      ? [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { client: { name: { contains: query.search, mode: 'insensitive' } } },
          { deal: { title: { contains: query.search, mode: 'insensitive' } } },
          { assignee: { name: { contains: query.search, mode: 'insensitive' } } },
        ]
      : undefined,
  }
}

async function assertClientInWorkspace(workspaceId: string, clientId?: string | null) {
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

async function assertDealInWorkspace(workspaceId: string, dealId?: string | null) {
  if (!dealId) {
    return
  }

  const deal = await prisma.deal.findFirst({
    where: { id: dealId, workspaceId },
    select: { id: true, clientId: true },
  })

  if (!deal) {
    throw new HttpError(400, 'Deal must belong to this workspace')
  }

  return deal
}

async function assertMemberInWorkspace(workspaceId: string, userId?: string | null) {
  if (!userId) {
    return
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!member) {
    throw new HttpError(400, 'Assignee must be a member of this workspace')
  }

  return member.user
}

async function assertTaskLinks(workspaceId: string, input: { clientId?: string | null; dealId?: string | null }) {
  const [deal] = await Promise.all([
    assertDealInWorkspace(workspaceId, input.dealId),
    assertClientInWorkspace(workspaceId, input.clientId),
  ])

  if (deal && input.clientId && deal.clientId !== input.clientId) {
    throw new HttpError(400, 'Task client must match the selected deal client')
  }

  return deal
}

async function writeTaskActivity(data: {
  workspaceId: string
  actorId: string
  taskId: string
  clientId?: string | null
  dealId?: string | null
  action: string
  metadata?: Prisma.InputJsonValue
}) {
  await prisma.activityLog.create({
    data: {
      workspaceId: data.workspaceId,
      actorId: data.actorId,
      taskId: data.taskId,
      clientId: data.clientId,
      dealId: data.dealId,
      action: data.action,
      entityType: 'Task',
      entityId: data.taskId,
      metadata: data.metadata,
    },
  })
}

async function notifyAssignee(data: {
  workspaceId: string
  assigneeId?: string | null
  title: string
  body: string
}) {
  if (!data.assigneeId) {
    return
  }

  await prisma.notification.create({
    data: {
      workspaceId: data.workspaceId,
      userId: data.assigneeId,
      title: data.title,
      body: data.body,
      type: 'TASK',
    },
  })
}

export async function listTasks(workspaceId: string, query: ListTasksQuery) {
  const where = buildTaskWhere(workspaceId, query)
  const skip = (query.page - 1) * query.pageSize

  const [items, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { updatedAt: 'desc' }],
      skip,
      take: query.pageSize,
    }),
    prisma.task.count({ where }),
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

export async function getTask(workspaceId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, workspaceId },
    include: {
      ...taskInclude,
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

  if (!task) {
    throw new HttpError(404, 'Task not found')
  }

  return task
}

export async function createTask(workspaceId: string, actorId: string, input: CreateTaskInput) {
  const [deal] = await Promise.all([
    assertTaskLinks(workspaceId, input),
    assertMemberInWorkspace(workspaceId, input.assigneeId),
  ])

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      clientId: input.clientId || deal?.clientId,
      dealId: input.dealId,
      assigneeId: input.assigneeId,
      createdById: actorId,
      workspaceId,
    },
    include: taskInclude,
  })

  await Promise.all([
    writeTaskActivity({
      workspaceId,
      actorId,
      taskId: task.id,
      clientId: task.clientId,
      dealId: task.dealId,
      action: 'TASK_CREATED',
      metadata: { title: task.title, priority: task.priority },
    }),
    notifyAssignee({
      workspaceId,
      assigneeId: task.assigneeId,
      title: 'Task assigned',
      body: task.title,
    }),
  ])

  return task
}

export async function updateTask(workspaceId: string, taskId: string, actorId: string, input: UpdateTaskInput) {
  await getTask(workspaceId, taskId)

  const [deal] = await Promise.all([
    assertTaskLinks(workspaceId, input),
    assertMemberInWorkspace(workspaceId, input.assigneeId),
  ])

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      completedAt: input.status === 'DONE' ? new Date() : input.status ? null : undefined,
      clientId: input.clientId || deal?.clientId,
      dealId: input.dealId,
      assigneeId: input.assigneeId,
    },
    include: taskInclude,
  })

  await Promise.all([
    writeTaskActivity({
      workspaceId,
      actorId,
      taskId: task.id,
      clientId: task.clientId,
      dealId: task.dealId,
      action: 'TASK_UPDATED',
      metadata: { status: task.status, priority: task.priority },
    }),
    notifyAssignee({
      workspaceId,
      assigneeId: input.assigneeId,
      title: 'Task updated',
      body: task.title,
    }),
  ])

  return task
}

export async function updateTaskStatus(
  workspaceId: string,
  taskId: string,
  actorId: string,
  input: UpdateTaskStatusInput,
) {
  const currentTask = await getTask(workspaceId, taskId)

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: input.status,
      completedAt: input.status === 'DONE' ? new Date() : null,
    },
    include: taskInclude,
  })

  await writeTaskActivity({
    workspaceId,
    actorId,
    taskId: task.id,
    clientId: task.clientId,
    dealId: task.dealId,
    action: 'TASK_STATUS_CHANGED',
    metadata: { from: currentTask.status, to: task.status },
  })

  return task
}

export async function assignTask(
  workspaceId: string,
  taskId: string,
  actorId: string,
  input: AssignTaskInput,
) {
  await getTask(workspaceId, taskId)
  const assignee = await assertMemberInWorkspace(workspaceId, input.assigneeId)

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { assigneeId: input.assigneeId },
    include: taskInclude,
  })

  await Promise.all([
    writeTaskActivity({
      workspaceId,
      actorId,
      taskId: task.id,
      clientId: task.clientId,
      dealId: task.dealId,
      action: 'TASK_ASSIGNED',
      metadata: { assigneeId: input.assigneeId, assigneeName: assignee?.name },
    }),
    notifyAssignee({
      workspaceId,
      assigneeId: input.assigneeId,
      title: 'Task assigned',
      body: task.title,
    }),
  ])

  return task
}

export async function deleteTask(workspaceId: string, taskId: string, actorId: string) {
  const task = await getTask(workspaceId, taskId)

  await prisma.$transaction(async (tx) => {
    await tx.activityLog.create({
      data: {
        workspaceId,
        actorId,
        taskId,
        clientId: task.clientId,
        dealId: task.dealId,
        action: 'TASK_DELETED',
        entityType: 'Task',
        entityId: taskId,
        metadata: { title: task.title },
      },
    })

    await tx.task.delete({
      where: { id: taskId },
    })
  })
}
