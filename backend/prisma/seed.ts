import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.activityLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.task.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.client.deleteMany()
  await prisma.pipelineStage.deleteMany()
  await prisma.workspaceMember.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()
  console.log('Database cleared.')

  console.log('Generating mock data...')

  const passwordHash = await bcrypt.hash('Password@123', 10)

  // 1. Create Users
  const userRoles = ['OWNER', 'ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER'] as const
  const usersToCreate = Array.from({ length: 15 }).map((_, i) => ({
    name: faker.person.fullName(),
    email: i === 0 ? 'admin@clientflow.io' : faker.internet.email(),
    passwordHash,
    avatarUrl: faker.image.avatar(),
    isEmailVerified: true,
  }))

  const users = await Promise.all(
    usersToCreate.map((u) => prisma.user.create({ data: u }))
  )
  const adminUser = users[0]

  // 2. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Global',
      slug: 'acme-global',
    },
  })

  // 3. Create Workspace Members
  await Promise.all(
    users.map((user, i) =>
      prisma.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: i === 0 ? 'OWNER' : faker.helpers.arrayElement(userRoles.slice(1)),
        },
      })
    )
  )

  // 4. Create Pipeline Stages
  const stageDefinitions = [
    { name: 'Lead', probability: 10 },
    { name: 'Qualified', probability: 30 },
    { name: 'Proposal', probability: 50 },
    { name: 'Negotiation', probability: 75 },
    { name: 'Closed Won', probability: 100 },
    { name: 'Closed Lost', probability: 0 },
  ]
  const stages = await Promise.all(
    stageDefinitions.map((s, i) =>
      prisma.pipelineStage.create({
        data: {
          name: s.name,
          position: i + 1,
          probability: s.probability,
          workspaceId: workspace.id,
        },
      })
    )
  )

  // 5. Create Clients
  const clientStatuses = ['LEAD', 'ACTIVE', 'AT_RISK', 'CHURNED'] as const
  const clientSegments = ['Enterprise', 'Mid-market', 'Small business', 'Startup']
  const clients = await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.client.create({
        data: {
          name: faker.company.name(),
          segment: faker.helpers.arrayElement(clientSegments),
          status: faker.helpers.arrayElement(clientStatuses),
          value: faker.number.int({ min: 1000, max: 100000 }).toString(),
          website: faker.internet.url(),
          notes: faker.lorem.paragraph(),
          lastContact: faker.date.recent({ days: 30 }),
          workspaceId: workspace.id,
          ownerId: faker.helpers.arrayElement(users).id,
        },
      })
    )
  )

  // 6. Create Contacts
  const contacts = await Promise.all(
    clients.flatMap((client) => {
      const numContacts = faker.number.int({ min: 1, max: 4 })
      return Array.from({ length: numContacts }).map((_, i) =>
        prisma.contact.create({
          data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            title: faker.person.jobTitle(),
            isPrimary: i === 0,
            clientId: client.id,
          },
        })
      )
    })
  )

  // 7. Create Deals
  const dealStatuses = ['OPEN', 'WON', 'LOST'] as const
  const deals = await Promise.all(
    Array.from({ length: 250 }).map(() => {
      const client = faker.helpers.arrayElement(clients)
      const isWon = faker.datatype.boolean({ probability: 0.3 })
      const isLost = faker.datatype.boolean({ probability: 0.2 })
      const status = isWon ? 'WON' : isLost ? 'LOST' : 'OPEN'
      
      let stageId = stages[0].id
      if (status === 'WON') stageId = stages[4].id
      else if (status === 'LOST') stageId = stages[5].id
      else stageId = faker.helpers.arrayElement(stages.slice(0, 4)).id

      return prisma.deal.create({
        data: {
          title: `${client.name} - ${faker.commerce.productName()}`,
          value: faker.number.int({ min: 5000, max: 250000 }).toString(),
          status,
          closeDate: status === 'OPEN' ? faker.date.future({ years: 0.5 }) : faker.date.recent({ days: 60 }),
          workspaceId: workspace.id,
          clientId: client.id,
          stageId,
          ownerId: faker.helpers.arrayElement(users).id,
        },
      })
    })
  )

  // 8. Create Tasks
  const taskStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE'] as const
  const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'] as const
  const tasks = await Promise.all(
    Array.from({ length: 400 }).map(() => {
      const client = faker.datatype.boolean() ? faker.helpers.arrayElement(clients) : null
      const clientDeals = client ? deals.filter(d => d.clientId === client.id) : []
      const deal = client && faker.datatype.boolean() && clientDeals.length > 0 ? faker.helpers.arrayElement(clientDeals) : null
      
      return prisma.task.create({
        data: {
          title: faker.hacker.phrase(),
          description: faker.lorem.sentences(2),
          status: faker.helpers.arrayElement(taskStatuses),
          priority: faker.helpers.arrayElement(taskPriorities),
          dueDate: faker.date.soon({ days: 30 }),
          completedAt: faker.datatype.boolean({ probability: 0.2 }) ? faker.date.recent() : null,
          workspaceId: workspace.id,
          clientId: client?.id,
          dealId: deal?.id,
          assigneeId: faker.helpers.arrayElement(users).id,
          createdById: faker.helpers.arrayElement(users).id,
        },
      })
    })
  )

  // 9. Create Invoices
  const invoiceStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'VOID'] as const
  const invoices = await Promise.all(
    Array.from({ length: 150 }).map(() => {
      const status = faker.helpers.arrayElement(invoiceStatuses)
      const issuedAt = faker.date.recent({ days: 90 })
      const dueAt = new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      return prisma.invoice.create({
        data: {
          invoiceNo: `INV-${faker.number.int({ min: 10000, max: 99999 })}`,
          amount: faker.number.int({ min: 1000, max: 50000 }).toString(),
          status,
          issuedAt,
          dueAt,
          paidAt: status === 'PAID' ? faker.date.between({ from: issuedAt, to: new Date() }) : null,
          workspaceId: workspace.id,
          clientId: faker.helpers.arrayElement(clients).id,
        },
      })
    })
  )

  // 10. Create Activity Logs
  const actions = ['DEAL_STAGE_CHANGED', 'INVOICE_PAID', 'CLIENT_CREATED', 'NOTE_ADDED', 'TASK_COMPLETED']
  await Promise.all(
    Array.from({ length: 500 }).map(() => {
      const entity = faker.helpers.arrayElement([
        { type: 'Deal', id: faker.helpers.arrayElement(deals).id },
        { type: 'Client', id: faker.helpers.arrayElement(clients).id },
        { type: 'Task', id: faker.helpers.arrayElement(tasks).id },
        { type: 'Invoice', id: faker.helpers.arrayElement(invoices).id },
      ])

      return prisma.activityLog.create({
        data: {
          action: faker.helpers.arrayElement(actions),
          entityType: entity.type,
          entityId: entity.id,
          metadata: { details: faker.lorem.sentence() },
          createdAt: faker.date.recent({ days: 30 }),
          workspaceId: workspace.id,
          actorId: faker.helpers.arrayElement(users).id,
        },
      })
    })
  )

  console.log('Seed complete! Massive mock dataset generated.')
  console.log(`Login Email: admin@clientflow.io | Password: Password@123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
