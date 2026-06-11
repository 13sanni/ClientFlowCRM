import { prisma } from '../../lib/prisma.js'

export async function getUserNotifications(userId: string, workspaceId: string) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      workspaceId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      workspaceId,
      isRead: false,
    },
  })

  return { notifications, unreadCount }
}

export async function markAsRead(notificationId: string, userId: string, workspaceId: string) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
      workspaceId,
    },
    data: {
      isRead: true,
    },
  })
}

export async function markAllAsRead(userId: string, workspaceId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      workspaceId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })
}
