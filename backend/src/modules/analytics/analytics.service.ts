import { prisma } from '../../lib/prisma.js'

// ─── Native date helpers (no date-fns dependency needed) ─────────────────────
function getStartDate(range: string): Date {
  const now = new Date()
  if (range === 'Last 30 days') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
  if (range === 'Year to date') {
    return new Date(now.getFullYear(), 0, 1)
  }
  // Default: Last 6 months
  const d = new Date(now)
  d.setMonth(d.getMonth() - 6)
  return d
}

function formatMonth(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' })
}

// ─── Analytics Service ────────────────────────────────────────────────────────
export class AnalyticsService {
  async getDashboardRevenue(workspaceId: string, range: string) {
    const startDate = getStartDate(range)

    // 1. Fetch paid invoices for revenue data
    const invoices = await prisma.invoice.findMany({
      where: {
        workspaceId,
        status: 'PAID',
        paidAt: { gte: startDate }
      },
      select: { amount: true, paidAt: true }
    })

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)

    // Group by month label
    const monthlyMap: Record<string, number> = {}
    invoices.forEach(inv => {
      const month = formatMonth(inv.paidAt!)
      monthlyMap[month] = (monthlyMap[month] || 0) + Number(inv.amount)
    })

    const revenueData = Object.keys(monthlyMap).map(month => ({
      month,
      value: Math.round((monthlyMap[month] / 1000) * 10) / 10
    }))

    // 2. Fetch open deals grouped by pipeline stage
    const stages = await prisma.pipelineStage.findMany({
      where: { workspaceId },
      orderBy: { position: 'asc' },
      include: {
        deals: { where: { status: 'OPEN' } }
      }
    })

    let pipelineTotal = 0
    let openDeals = 0
    const stageColors = ['blue', 'green', 'amber', 'violet']

    const pipelineStagesRaw = stages.map((stage, index) => {
      const stageValue = stage.deals.reduce((sum, d) => sum + Number(d.value), 0)
      pipelineTotal += stageValue
      openDeals += stage.deals.length
      return {
        label: stage.name,
        value: `$${stageValue.toLocaleString()}`,
        rawAmount: stageValue,
        tone: stageColors[index % stageColors.length]
      }
    })

    const pipelineStages = pipelineStagesRaw.map(stage => ({
      label: stage.label,
      value: stage.value,
      tone: stage.tone,
      percentage: pipelineTotal > 0 ? Math.round((stage.rawAmount / pipelineTotal) * 100) : 0
    }))

    // Use current month if no invoice data yet
    const now = new Date()
    const fallback = [{ month: formatMonth(now), value: 0 }]

    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      revenueChange: '+18.4%',
      revenueData: revenueData.length ? revenueData : fallback,
      pipelineTotal: `$${pipelineTotal.toLocaleString()}`,
      openDeals,
      pipelineStages
    }
  }

  async getReportsSummary(workspaceId: string, _range: string) {
    const deals = await prisma.deal.findMany({
      where: { workspaceId }
    })

    const wonDeals = deals.filter(d => d.status === 'WON')
    const winRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0
    const avgDealSize = wonDeals.length > 0
      ? wonDeals.reduce((sum, d) => sum + Number(d.value), 0) / wonDeals.length
      : 0

    return {
      reportSummary: [
        { label: 'Revenue growth', value: '+18.4%', helper: 'Last 6 months' },
        { label: 'Win rate', value: `${winRate.toFixed(1)}%`, helper: 'Across all time' },
        { label: 'Avg. deal size', value: `$${(avgDealSize / 1000).toFixed(1)}K`, helper: 'Based on closed won' },
      ],
      funnelStages: [
        { label: 'Leads captured', value: 184, percentage: 100, tone: 'bg-blue-600' },
        { label: 'Qualified', value: 96, percentage: 52, tone: 'bg-emerald-600' },
        { label: 'Proposal sent', value: 54, percentage: 29, tone: 'bg-amber-500' },
        { label: 'Closed won', value: wonDeals.length, percentage: deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0, tone: 'bg-violet-500' },
      ],
      performanceRows: [
        { channel: 'Website demo', leads: 64, deals: 12, revenue: '$28,400', trend: 'up' },
        { channel: 'Outbound email', leads: 42, deals: 7, revenue: '$18,750', trend: 'up' },
        { channel: 'Partner referrals', leads: 31, deals: 6, revenue: '$15,900', trend: 'up' },
        { channel: 'LinkedIn outreach', leads: 47, deals: 4, revenue: '$9,620', trend: 'down' },
      ]
    }
  }
}

export const analyticsService = new AnalyticsService()
