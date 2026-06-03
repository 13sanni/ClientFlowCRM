import { cn } from '../../lib/utils'

const clients = [
  {
    company: 'Northstar Labs',
    contact: 'Olivia Martin',
    email: 'olivia@northstarlabs.com',
    initials: 'NL',
    owner: 'Maya Patel',
    value: '$18,400',
    status: 'Active',
    tone: 'green',
  },
  {
    company: 'Clearline Media',
    contact: 'Ethan Brooks',
    email: 'ethan@clearlinemedia.com',
    initials: 'CM',
    owner: 'Jordan Davis',
    value: '$12,750',
    status: 'Proposal',
    tone: 'blue',
  },
  {
    company: 'BrightPath Co.',
    contact: 'Sophia Chen',
    email: 'sophia@brightpath.co',
    initials: 'BP',
    owner: 'Maya Patel',
    value: '$9,860',
    status: 'New lead',
    tone: 'violet',
  },
  {
    company: 'Vertex Systems',
    contact: 'Noah Williams',
    email: 'noah@vertexsystems.io',
    initials: 'VS',
    owner: 'Jordan Davis',
    value: '$22,300',
    status: 'Active',
    tone: 'green',
  },
  {
    company: 'Harbor & Pine',
    contact: 'Ava Thompson',
    email: 'ava@harborandpine.com',
    initials: 'HP',
    owner: 'Luis Garcia',
    value: '$7,240',
    status: 'Follow-up',
    tone: 'amber',
  },
]

const statusStyles = {
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

function RecentClients() {
  return (
    <section
      className="mt-4 rounded-lg border border-slate-200 bg-white"
      aria-labelledby="recent-clients-title"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
        <div>
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Client activity
          </p>
          <h2 id="recent-clients-title" className="mt-1 text-base font-bold tracking-normal text-slate-700">
            Recent clients
          </h2>
        </div>
        <button className="border-0 bg-transparent text-[11px] font-bold text-blue-700 hover:text-blue-800" type="button">
          View all clients
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[740px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Company
              </th>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Contact
              </th>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Owner
              </th>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Deal value
              </th>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Status
              </th>
              <th className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.company}>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2.5 font-bold text-slate-700">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-600">
                      {client.initials}
                    </span>
                    <span>{client.company}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <div className="grid gap-0.5 text-slate-600">
                    <span>{client.contact}</span>
                    <small className="text-[10px] font-semibold text-slate-400">{client.email}</small>
                  </div>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  {client.owner}
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                  {client.value}
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[client.tone])}>
                    {client.status}
                  </span>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <button
                    className="border-0 bg-transparent text-[15px] leading-none text-slate-400"
                    type="button"
                    aria-label={`Open ${client.company}`}
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecentClients
