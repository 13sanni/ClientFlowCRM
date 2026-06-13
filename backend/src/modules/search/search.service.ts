import { prisma } from '../../lib/prisma.js'

export async function globalSearch(workspaceId: string, query: string) {
  if (!query || query.trim() === '') {
    return { clients: [], deals: [], tasks: [], invoices: [] }
  }

  const q = query.trim()

  const [clients, deals, tasks, invoices] = await Promise.all([
    prisma.client.findMany({
      where: {
        workspaceId,
        isDeleted: false,
        name: { contains: q, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, name: true, status: true }
    }),
    prisma.deal.findMany({
      where: {
        workspaceId,
        isDeleted: false,
        title: { contains: q, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, title: true, status: true }
    }),
    prisma.task.findMany({
      where: {
        workspaceId,
        isDeleted: false,
        title: { contains: q, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, title: true, status: true }
    }),
    prisma.invoice.findMany({
      where: {
        workspaceId,
        invoiceNo: { contains: q, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, invoiceNo: true, status: true }
    })
  ])

  return { clients, deals, tasks, invoices }
}
