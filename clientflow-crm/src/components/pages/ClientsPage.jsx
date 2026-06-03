import { useState } from 'react'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'

const clientSummary = [
  { label: 'Active clients', value: '84' },
  { label: 'New this month', value: '18' },
  { label: 'At-risk accounts', value: '6' },
]

const clients = [
  {
    company: 'Northstar Labs',
    segment: 'Enterprise',
    owner: 'Maya Patel',
    value: '$18,400',
    status: 'Active',
    lastContact: 'Today',
  },
  {
    company: 'Clearline Media',
    segment: 'Mid-market',
    owner: 'Jordan Davis',
    value: '$12,750',
    status: 'Proposal',
    lastContact: 'Yesterday',
  },
  {
    company: 'BrightPath Co.',
    segment: 'Startup',
    owner: 'Maya Patel',
    value: '$9,860',
    status: 'New lead',
    lastContact: 'Jun 1',
  },
  {
    company: 'Vertex Systems',
    segment: 'Enterprise',
    owner: 'Jordan Davis',
    value: '$22,300',
    status: 'Active',
    lastContact: 'May 31',
  },
  {
    company: 'Harbor & Pine',
    segment: 'Small business',
    owner: 'Luis Garcia',
    value: '$7,240',
    status: 'Follow-up',
    lastContact: 'May 30',
  },
]

const statusTone = {
  Active: 'bg-emerald-50 text-emerald-700',
  Proposal: 'bg-blue-50 text-blue-700',
  'New lead': 'bg-violet-50 text-violet-700',
  'Follow-up': 'bg-amber-50 text-amber-700',
}

function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)

  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">Accounts</p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Clients</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
          onClick={() => setIsAddClientOpen(true)}
        >
          Add client
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Client summary"
      >
        {clientSummary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
          </article>
        ))}
      </section>

      <section
        className="mt-4 rounded-lg border border-slate-200 bg-white"
        aria-labelledby="client-directory-title"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
              Directory
            </p>
            <h2 id="client-directory-title" className="mt-1 text-base font-bold text-slate-700">
              Client accounts
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              All segments
            </button>
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] border-collapse text-left">
            <thead>
              <tr>
                {['Company', 'Segment', 'Owner', 'Deal value', 'Status', 'Last contact'].map((heading) => (
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
              {clients.map((client) => (
                <tr key={client.company}>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                    {client.company}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {client.segment}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {client.owner}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                    {client.value}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusTone[client.status])}>
                      {client.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {client.lastContact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isAddClientOpen && (
        <ActionModal
          title="Add client"
          description="Capture a new account. This UI will connect to backend CRUD later."
          primaryLabel="Add client"
          onClose={() => setIsAddClientOpen(false)}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Company name</span>
            <input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300" placeholder="Acme Corp" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Contact email</span>
            <input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300" placeholder="name@company.com" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Owner</span>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
              <option>Jordan Davis</option>
              <option>Maya Patel</option>
              <option>Luis Garcia</option>
            </select>
          </label>
        </ActionModal>
      )}
    </main>
  )
}

export default ClientsPage
