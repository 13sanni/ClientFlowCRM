import { useState } from 'react'
import ActionDropdown from '../common/ActionDropdown'
import { cn } from '../../lib/utils'

const revenueData = [
  { month: 'Jan', value: 18 },
  { month: 'Feb', value: 24 },
  { month: 'Mar', value: 22 },
  { month: 'Apr', value: 31 },
  { month: 'May', value: 36 },
  { month: 'Jun', value: 42 },
]

const pipelineStages = [
  { label: 'Qualified', value: '$32,640', percentage: 38, tone: 'blue' },
  { label: 'Proposal', value: '$24,300', percentage: 28, tone: 'green' },
  { label: 'Negotiation', value: '$18,520', percentage: 21, tone: 'amber' },
  { label: 'Closing', value: '$10,960', percentage: 13, tone: 'violet' },
]

const stageStyles = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-600',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
}

const chartPoints = revenueData
  .map(({ value }, index) => {
    const x = 30 + index * 68
    const y = 154 - value * 2.7

    return `${x},${y}`
  })
  .join(' ')

function RevenueOverview() {
  const [selectedRange, setSelectedRange] = useState('Last 6 months')

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
          <p className="m-0 text-[25px] font-bold text-slate-900">$42,860</p>
          <span className="text-[11px] font-bold text-emerald-700">+18.4% vs previous period</span>
        </div>

        <div className="mt-1.5">
          <svg
            className="block min-h-[190px] w-full"
            viewBox="0 0 390 190"
            role="img"
            aria-labelledby="revenue-chart-title revenue-chart-description"
          >
            <title id="revenue-chart-title">Monthly revenue trend</title>
            <desc id="revenue-chart-description">
              Revenue increased from eighteen thousand dollars in January to forty-two thousand
              dollars in June.
            </desc>
            {[36, 76, 116, 156].map((y) => (
              <line
                key={y}
                className="stroke-slate-100"
                x1="30"
                x2="370"
                y1={y}
                y2={y}
                strokeWidth="1"
              />
            ))}
            <polyline
              className="fill-none stroke-blue-600 [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:3px]"
              points={chartPoints}
            />
            {revenueData.map(({ month, value }, index) => {
              const x = 30 + index * 68
              const y = 154 - value * 2.7

              return (
                <g key={month}>
                  <circle className="fill-white stroke-blue-600 [stroke-width:3px]" cx={x} cy={y} r="4" />
                  <text
                    className="fill-slate-400 text-[10px] font-bold"
                    x={x}
                    y="182"
                    textAnchor="middle"
                  >
                    {month}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="border-l border-slate-200 p-5 max-[1100px]:border-l-0 max-[1100px]:border-t">
        <div>
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">Sales pipeline</p>
          <h2 className="mt-1 text-base font-bold tracking-normal text-slate-700">$86,420</h2>
          <span className="mt-1 block text-[11px] font-semibold text-slate-400">32 open deals</span>
        </div>

        <div className="mt-6 grid gap-4">
          {pipelineStages.map((stage) => (
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
