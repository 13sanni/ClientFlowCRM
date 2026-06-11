import { prisma } from '../../lib/prisma.js'

export async function createFileAttachment(data: {
  fileName: string
  mimeType: string
  size: number
  storageKey: string
  url: string
  workspaceId: string
  uploadedById: string
  clientId?: string
  dealId?: string
  invoiceId?: string
}) {
  return prisma.fileAttachment.create({
    data,
  })
}
