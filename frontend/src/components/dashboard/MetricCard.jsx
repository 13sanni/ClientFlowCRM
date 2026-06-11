import { cn } from '../../lib/utils'

const markerStyles = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-600',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
}

const trendStyles = {
  up: 'text-emerald-700',
  down: 'text-orange-600',
}

function MetricCard({ label, value, change, trend, tone }) {
  const trendLabel = trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'
  const hasChange = change && change !== '-' && change !== '0%'

  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-xs font-bold text-slate-500">{label}</p>
        <span
          className={cn('h-[9px] w-[9px] shrink-0 rounded-full', markerStyles[tone])}
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 m-0 text-2xl font-bold tracking-normal text-slate-900">{value}</p>
      {hasChange ? (
        <p className={cn('mt-2.5 flex items-center gap-0.5 text-[11px] font-bold', trendStyles[trend] || 'text-slate-500')}>
          <span aria-hidden="true">{trend === 'up' ? '+' : trend === 'down' ? '-' : ''}</span>
          {change}
          <span className="ml-1 font-semibold text-slate-400">{trendLabel} vs last month</span>
        </p>
      ) : (
        <p className="mt-2.5 flex items-center gap-0.5 text-[11px] font-semibold text-slate-400">
          Current period
        </p>
      )}
    </article>
  )
}

export default MetricCard
