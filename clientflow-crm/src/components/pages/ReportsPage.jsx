import { cn } from '../../lib/utils'

const reportSummary = [
  { label: 'Revenue growth', value: '+18.4%', helper: 'Last 6 months' },
  { label: 'Win rate', value: '28.6%', helper: '+3.7% vs previous' },
  { label: 'Avg. deal size', value: '$8.1K', helper: 'Across open pipeline' },
]

const funnelStages = [
  { label: 'Leads captured', value: 184, percentage: 100, tone: 'bg-blue-600' },
  { label: 'Qualified', value: 96, percentage: 52, tone: 'bg-emerald-600' },
  { label: 'Proposal sent', value: 54, percentage: 29, tone: 'bg-amber-500' },
  { label: 'Closed won', value: 21, percentage: 11, tone: 'bg-violet-500' },
]

const performanceRows = [
  { channel: 'Website demo', leads: 64, deals: 12, revenue: '$28,400', trend: 'up' },
  { channel: 'Outbound email', leads: 42, deals: 7, revenue: '$18,750', trend: 'up' },
  { channel: 'Partner referrals', leads: 31, deals: 6, revenue: '$15,900', trend: 'up' },
  { channel: 'LinkedIn outreach', leads: 47, deals: 4, revenue: '$9,620', trend: 'down' },
]

function ReportsPage() {
  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Analytics
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Reports</h1>
        </div>
        <button
          className="rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-300"
          type="button"
        >
          Export report
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Report summary"
      >
        {reportSummary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
            <span className="mt-1 block text-[11px] font-semibold text-slate-400">{item.helper}</span>
          </article>
        ))}
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 max-[1100px]:grid-cols-1">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Conversion funnel
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Lead performance</h2>

          <div className="mt-6 grid gap-4">
            {funnelStages.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="m-0 text-xs font-bold text-slate-600">{stage.label}</p>
                  <span className="text-xs font-bold text-slate-700">{stage.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className={cn('block h-full rounded-full', stage.tone)}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
            <div>
              <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Channels
              </p>
              <h2 className="mt-1 text-base font-bold text-slate-700">Revenue sources</h2>
            </div>
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              This quarter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr>
                  {['Channel', 'Leads', 'Deals', 'Revenue', 'Trend'].map((heading) => (
                    <th
                      className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400"
                      key={heading}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {performanceRows.map((row) => (
                  <tr key={row.channel}>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      {row.channel}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {row.leads}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {row.deals}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      {row.revenue}
                    </td>
                    <td
                      className={cn(
                        'whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold',
                        row.trend === 'up' ? 'text-emerald-700' : 'text-red-600',
                      )}
                    >
                      {row.trend === 'up' ? 'Improving' : 'Declining'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  )
}

export default ReportsPage
