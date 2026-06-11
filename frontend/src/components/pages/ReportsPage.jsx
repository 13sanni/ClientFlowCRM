import { useState, useEffect } from 'react'
import ActionDropdown from '../common/ActionDropdown'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'

function ReportsPage() {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [rangeFilter, setRangeFilter] = useState('This quarter')
  const [isLoading, setIsLoading] = useState(true)
  
  const [data, setData] = useState({
    reportSummary: [],
    funnelStages: [],
    performanceRows: []
  })

  useEffect(() => {
    async function fetchReports() {
      try {
        setIsLoading(true)
        const res = await api.get(`/analytics/reports/summary?range=${rangeFilter}`)
        setData(res)
      } catch (err) {
        console.error('Failed to load reports', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [rangeFilter])

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
          onClick={() => setIsExportOpen(true)}
        >
          Export report
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Report summary"
      >
        {isLoading && data.reportSummary.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse" key={i}>
              <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
              <div className="h-8 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-2 w-16 bg-slate-200 rounded"></div>
            </article>
          ))
        ) : (
          data.reportSummary.map((item) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
              <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
              <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
              <span className="mt-1 block text-[11px] font-semibold text-slate-400">{item.helper}</span>
            </article>
          ))
        )}
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 max-[1100px]:grid-cols-1">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Conversion funnel
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Lead performance</h2>

          <div className="mt-6 grid gap-4">
            {isLoading && data.funnelStages.length === 0 ? (
               Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="animate-pulse">
                   <div className="flex justify-between mb-2">
                     <div className="h-3 w-20 bg-slate-200 rounded"></div>
                     <div className="h-3 w-6 bg-slate-200 rounded"></div>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full"></div>
                 </div>
               ))
            ) : (
              data.funnelStages.map((stage) => (
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
              ))
            )}
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
            <ActionDropdown label={rangeFilter}>
              {['This quarter', 'Last quarter', 'Year to date', 'Last 12 months'].map((range) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={range}
                  type="button"
                  onClick={() => setRangeFilter(range)}
                >
                  {range}
                </button>
              ))}
            </ActionDropdown>
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
                {isLoading && data.performanceRows.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="border-t border-slate-100 px-5 py-3"><div className="h-3 w-24 bg-slate-200 rounded"></div></td>
                      <td className="border-t border-slate-100 px-5 py-3"><div className="h-3 w-8 bg-slate-200 rounded"></div></td>
                      <td className="border-t border-slate-100 px-5 py-3"><div className="h-3 w-8 bg-slate-200 rounded"></div></td>
                      <td className="border-t border-slate-100 px-5 py-3"><div className="h-3 w-16 bg-slate-200 rounded"></div></td>
                      <td className="border-t border-slate-100 px-5 py-3"><div className="h-3 w-12 bg-slate-200 rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  data.performanceRows.map((row) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {isExportOpen && (
        <ActionModal
          title="Export report"
          description="Choose a report format to prepare your export."
          primaryLabel="Prepare export"
          onClose={() => setIsExportOpen(false)}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Report type</span>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
              <option>Revenue summary</option>
              <option>Pipeline performance</option>
              <option>Task productivity</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Format</span>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
              <option>CSV</option>
              <option>PDF</option>
            </select>
          </label>
        </ActionModal>
      )}
    </main>
  )
}

export default ReportsPage
