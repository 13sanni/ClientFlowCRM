import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import ActionDropdown from '../common/ActionDropdown'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'

const stageStyles = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-600',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
}

function RevenueOverview() {
  const [selectedRange, setSelectedRange] = useState('Last 6 months')
  const [data, setData] = useState({
    totalRevenue: '-',
    revenueChange: '0%',
    revenueData: [],
    pipelineTotal: '-',
    openDeals: 0,
    pipelineStages: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true)
        const res = await api.get(`/analytics/dashboard/revenue?range=${selectedRange}`)
        setData(res)
      } catch (err) {
        console.error('Failed to load revenue analytics', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [selectedRange])

  return (
    <section
      className="mt-4 grid grid-cols-[minmax(0,1fr)_260px] rounded-lg border border-slate-200 bg-white max-[1100px]:grid-cols-1"
      aria-labelledby="revenue-overview-title"
    >
      <div className="min-w-0 px-5 pb-2.5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
              Performance
            </p>
            <h2 id="revenue-overview-title" className="mt-1 text-base font-bold tracking-normal text-slate-700">
              Revenue overview
            </h2>
          </div>
          <ActionDropdown label={selectedRange}>
            {['Last 30 days', 'Last 6 months', 'Year to date'].map((range) => (
              <button
                className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </ActionDropdown>
        </div>

        <div className="mt-5 flex items-baseline gap-2.5 max-[520px]:grid max-[520px]:gap-1">
          <p className="m-0 text-[25px] font-bold text-slate-900">{data.totalRevenue}</p>
          <span className="text-[11px] font-bold text-emerald-700">{data.revenueChange} vs previous period</span>
        </div>

        <div className="mt-1.5 h-[190px] w-full">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="border-l border-slate-200 p-5 max-[1100px]:border-l-0 max-[1100px]:border-t">
        <div>
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">Sales pipeline</p>
          <h2 className="mt-1 text-base font-bold tracking-normal text-slate-700">{data.pipelineTotal}</h2>
          <span className="mt-1 block text-[11px] font-semibold text-slate-400">{data.openDeals} open deals</span>
        </div>

        <div className="mt-6 grid gap-4">
          {data.pipelineStages.map((stage) => (
            <div key={stage.label}>
              <div className="flex items-center justify-between gap-3">
                <p className="m-0 flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <span
                    className={cn('h-[7px] w-[7px] rounded-full', stageStyles[stage.tone])}
                    aria-hidden="true"
                  />
                  {stage.label}
                </p>
                <span className="text-[11px] font-bold text-slate-700">{stage.value}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <span
                  className={cn('block h-full rounded-full', stageStyles[stage.tone])}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RevenueOverview
