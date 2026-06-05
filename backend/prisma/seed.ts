import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsertUser(name: string, email: string) {
  const passwordHash = await bcrypt.hash('Password@123', 10)

  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      name,
      email,
      passwordHash,
      isEmailVerified: true,
    },
  })
}

async function findOrCreateClient(data: {
  name: string
  segment: string
  status: 'LEAD' | 'ACTIVE' | 'AT_RISK' | 'CHURNED'
  value: string
  workspaceId: string
  ownerId: string
}) {
  const existingClient = await prisma.client.findFirst({
    where: { name: data.name, workspaceId: data.workspaceId },
  })

  if (existingClient) {
    return prisma.client.update({
      where: { id: existingClient.id },
      data,
    })
  }

  return prisma.client.create({ data })
}

async function main() {
  const [jordan, maya, luis] = await Promise.all([
    upsertUser('Jordan Davis', 'jordan@clientflow.io'),
    upsertUser('Maya Patel', 'maya@clientflow.io'),
    upsertUser('Luis Garcia', 'luis@clientflow.io'),
  ])

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-studio' },
    update: { name: 'Acme Studio' },
    create: {
      name: 'Acme Studio',
      slug: 'acme-studio',
    },
  })

  await Promise.all([
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: jordan.id, workspaceId: workspace.id } },
      update: { role: 'OWNER' },
      create: { userId: jordan.id, workspaceId: workspace.id, role: 'OWNER' },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: maya.id, workspaceId: workspace.id } },
      update: { role: 'MANAGER' },
      create: { userId: maya.id, workspaceId: workspace.id, role: 'MANAGER' },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: luis.id, workspaceId: workspace.id } },
      update: { role: 'SALES_REP' },
      create: { userId: luis.id, workspaceId: workspace.id, role: 'SALES_REP' },
    }),
  ])

  const stages = await Promise.all(
    [
      { name: 'Qualified', position: 1, probability: 35 },
      { name: 'Proposal', position: 2, probability: 55 },
      { name: 'Negotiation', position: 3, probability: 75 },
      { name: 'Closing', position: 4, probability: 90 },
    ].map((stage) =>
      prisma.pipelineStage.upsert({
        where: { workspaceId_name: { workspaceId: workspace.id, name: stage.name } },
        update: {
          position: stage.position,
          probability: stage.probability,
        },
        create: {
          ...stage,
          workspaceId: workspace.id,
        },
      }),
    ),
  )

  const stageByName = Object.fromEntries(stages.map((stage) => [stage.name, stage]))

  const clients = await Promise.all([
    findOrCreateClient({
      name: 'Northstar Labs',
      segment: 'Enterprise',
      status: 'ACTIVE',
      value: '18400',
      workspaceId: workspace.id,
      ownerId: maya.id,
    }),
    findOrCreateClient({
      name: 'Clearline Media',
      segment: 'Mid-market',
      status: 'LEAD',
      value: '12750',
      workspaceId: workspace.id,
      ownerId: jordan.id,
    }),
    findOrCreateClient({
      name: 'BrightPath Co.',
      segment: 'Startup',
      status: 'LEAD',
      value: '9860',
      workspaceId: workspace.id,
      ownerId: maya.id,
    }),
    findOrCreateClient({
      name: 'Vertex Systems',
      segment: 'Enterprise',
      status: 'ACTIVE',
      value: '22300',
      workspaceId: workspace.id,
      ownerId: jordan.id,
    }),
    findOrCreateClient({
      name: 'Harbor & Pine',
      segment: 'Small business',
      status: 'AT_RISK',
      value: '7240',
      workspaceId: workspace.id,
      ownerId: luis.id,
    }),
  ])

  const clientByName = Object.fromEntries(clients.map((client) => [client.name, client]))

  await Promise.all([
    { client: 'Northstar Labs', name: 'Olivia Martin', email: 'olivia@northstarlabs.com' },
    { client: 'Clearline Media', name: 'Ethan Brooks', email: 'ethan@clearlinemedia.com' },
    { client: 'BrightPath Co.', name: 'Sophia Chen', email: 'sophia@brightpath.co' },
    { client: 'Vertex Systems', name: 'Noah Williams', email: 'noah@vertexsystems.io' },
    { client: 'Harbor & Pine', name: 'Ava Thompson', email: 'ava@harborandpine.com' },
  ].map(async (contact) => {
    const client = clientByName[contact.client]
    const existingContact = await prisma.contact.findFirst({
      where: { clientId: client.id, email: contact.email },
    })

    return existingContact
      ? prisma.contact.update({ where: { id: existingContact.id }, data: contact })
      : prisma.contact.create({
          data: {
            ...contact,
            client: undefined,
            clientId: client.id,
            isPrimary: true,
          },
        })
  }))

  await Promise.all([
    {
      title: 'Website demo request',
      source: 'Website demo',
      status: 'QUALIFIED',
      estimatedValue: '8400',
      clientId: clientByName['Northstar Labs'].id,
      ownerId: maya.id,
    },
    {
      title: 'LinkedIn outreach reply',
      source: 'LinkedIn outreach',
      status: 'CONTACTED',
      estimatedValue: '6200',
      clientId: clientByName['BrightPath Co.'].id,
      ownerId: maya.id,
    },
  ].map(async (lead) => {
    const existingLead = await prisma.lead.findFirst({
      where: { title: lead.title, workspaceId: workspace.id },
    })

    return existingLead
      ? prisma.lead.update({ where: { id: existingLead.id }, data: lead })
      : prisma.lead.create({ data: { ...lead, workspaceId: workspace.id } })
  }))

  const deals = await Promise.all([
    {
      title: 'Northstar expansion',
      value: '18400',
      closeDate: new Date('2026-06-12'),
      clientId: clientByName['Northstar Labs'].id,
      stageId: stageByName.Qualified.id,
      ownerId: maya.id,
    },
    {
      title: 'Media buying suite',
      value: '12750',
      closeDate: new Date('2026-06-10'),
      clientId: clientByName['Clearline Media'].id,
      stageId: stageByName.Proposal.id,
      ownerId: jordan.id,
    },
    {
      title: 'Analytics rollout',
      value: '8660',
      closeDate: new Date('2026-06-22'),
      clientId: clientByName['Vertex Systems'].id,
      stageId: stageByName.Negotiation.id,
      ownerId: jordan.id,
    },
  ].map(async (deal) => {
    const existingDeal = await prisma.deal.findFirst({
      where: { title: deal.title, workspaceId: workspace.id },
    })

    return existingDeal
      ? prisma.deal.update({ where: { id: existingDeal.id }, data: deal })
      : prisma.deal.create({ data: { ...deal, workspaceId: workspace.id } })
  }))

  const dealByTitle = Object.fromEntries(deals.map((deal) => [deal.title, deal]))

  await Promise.all([
    {
      title: 'Send proposal revision',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-06-04'),
      clientId: clientByName['Clearline Media'].id,
      dealId: dealByTitle['Media buying suite'].id,
      assigneeId: jordan.id,
      createdById: maya.id,
    },
    {
      title: 'Prepare onboarding checklist',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-06-05'),
      clientId: clientByName['Northstar Labs'].id,
      dealId: dealByTitle['Northstar expansion'].id,
      assigneeId: maya.id,
      createdById: jordan.id,
    },
    {
      title: 'Follow up on unpaid invoice',
      status: 'BLOCKED',
      priority: 'HIGH',
      dueDate: new Date('2026-05-31'),
      clientId: clientByName['Harbor & Pine'].id,
      assigneeId: luis.id,
      createdById: jordan.id,
    },
  ].map(async (task) => {
    const existingTask = await prisma.task.findFirst({
      where: { title: task.title, workspaceId: workspace.id },
    })

    return existingTask
      ? prisma.task.update({ where: { id: existingTask.id }, data: task })
      : prisma.task.create({ data: { ...task, workspaceId: workspace.id } })
  }))

  await Promise.all([
    {
      invoiceNo: 'INV-1048',
      amount: '8400',
      status: 'PAID',
      issuedAt: new Date('2026-05-28'),
      dueAt: new Date('2026-06-07'),
      paidAt: new Date('2026-06-03'),
      clientId: clientByName['Northstar Labs'].id,
    },
    {
      invoiceNo: 'INV-1049',
      amount: '6750',
      status: 'SENT',
      issuedAt: new Date('2026-05-30'),
      dueAt: new Date('2026-06-12'),
      clientId: clientByName['Clearline Media'].id,
    },
    {
      invoiceNo: 'INV-1050',
      amount: '4200',
      status: 'OVERDUE',
      issuedAt: new Date('2026-05-18'),
      dueAt: new Date('2026-05-31'),
      clientId: clientByName['Harbor & Pine'].id,
    },
  ].map((invoice) =>
    prisma.invoice.upsert({
      where: { workspaceId_invoiceNo: { workspaceId: workspace.id, invoiceNo: invoice.invoiceNo } },
      update: invoice,
      create: { ...invoice, workspaceId: workspace.id },
    }),
  ))

  await Promise.all([
    {
      title: 'Invoice paid',
      body: 'Northstar Labs paid INV-1048.',
      type: 'INVOICE',
      userId: jordan.id,
    },
    {
      title: 'Task assigned',
      body: 'Maya assigned onboarding checklist.',
      type: 'TASK',
      userId: maya.id,
    },
    {
      title: 'Deal moved',
      body: 'Vertex Systems moved to negotiation.',
      type: 'DEAL',
      userId: jordan.id,
    },
  ].map(async (notification) => {
    const existingNotification = await prisma.notification.findFirst({
      where: { title: notification.title, workspaceId: workspace.id, userId: notification.userId },
    })

    return existingNotification
      ? prisma.notification.update({ where: { id: existingNotification.id }, data: notification })
      : prisma.notification.create({ data: { ...notification, workspaceId: workspace.id } })
  }))

  await Promise.all([
    {
      action: 'DEAL_STAGE_CHANGED',
      entityType: 'Deal',
      entityId: dealByTitle['Analytics rollout'].id,
      actorId: jordan.id,
      dealId: dealByTitle['Analytics rollout'].id,
      clientId: clientByName['Vertex Systems'].id,
      metadata: { from: 'Proposal', to: 'Negotiation' },
    },
    {
      action: 'INVOICE_PAID',
      entityType: 'Invoice',
      entityId: 'INV-1048',
      actorId: jordan.id,
      clientId: clientByName['Northstar Labs'].id,
      metadata: { invoiceNo: 'INV-1048', amount: 8400 },
    },
  ].map(async (activity) => {
    const existingActivity = await prisma.activityLog.findFirst({
      where: {
        workspaceId: workspace.id,
        action: activity.action,
        entityType: activity.entityType,
        entityId: activity.entityId,
      },
    })

    return existingActivity
      ? prisma.activityLog.update({ where: { id: existingActivity.id }, data: activity })
      : prisma.activityLog.create({ data: { ...activity, workspaceId: workspace.id } })
  }))

  console.log('Seed complete: demo CRM workspace is ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
