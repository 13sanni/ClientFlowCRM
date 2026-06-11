import { PrismaClient } from '@prisma/client'

const basePrisma = new PrismaClient()

// Helper to apply soft delete filters
const applySoftDelete = {
  async findMany({ args, query }: any) {
    args.where = { isDeleted: false, ...args.where }
    return query(args)
  },
  async findUnique({ args, query }: any) {
    args.where = { isDeleted: false, ...args.where }
    return query(args)
  },
  async findFirst({ args, query }: any) {
    args.where = { isDeleted: false, ...args.where }
    return query(args)
  },
  async count({ args, query }: any) {
    args.where = { isDeleted: false, ...args.where }
    return query(args)
  }
}

export const prisma = basePrisma.$extends({
  query: {
    client: {
      ...applySoftDelete,
      async delete({ args }: any) {
        return basePrisma.client.update({ ...args, data: { isDeleted: true } })
      },
      async deleteMany({ args }: any) {
        return basePrisma.client.updateMany({ ...args, data: { isDeleted: true } })
      }
    },
    lead: {
      ...applySoftDelete,
      async delete({ args }: any) {
        return basePrisma.lead.update({ ...args, data: { isDeleted: true } })
      },
      async deleteMany({ args }: any) {
        return basePrisma.lead.updateMany({ ...args, data: { isDeleted: true } })
      }
    },
    deal: {
      ...applySoftDelete,
      async delete({ args }: any) {
        return basePrisma.deal.update({ ...args, data: { isDeleted: true } })
      },
      async deleteMany({ args }: any) {
        return basePrisma.deal.updateMany({ ...args, data: { isDeleted: true } })
      }
    },
    task: {
      ...applySoftDelete,
      async delete({ args }: any) {
        return basePrisma.task.update({ ...args, data: { isDeleted: true } })
      },
      async deleteMany({ args }: any) {
        return basePrisma.task.updateMany({ ...args, data: { isDeleted: true } })
      }
    }
  }
})
