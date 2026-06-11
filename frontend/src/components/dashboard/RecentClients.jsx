import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ActionDropdown from '../common/ActionDropdown'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'

const statusStyles = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  PROPOSAL: 'bg-blue-50 text-blue-700',
  NEW_LEAD: 'bg-violet-50 text-violet-700',
  FOLLOW_UP: 'bg-amber-50 text-amber-700',
}

function RecentClients() {
  const [clientAction, setClientAction] = useState(null)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecentClients() {
      try {
        setIsLoading(true)
        const res = await api.get('/clients?page=1&pageSize=5')
        setClients(res.items || [])
      } catch (err) {
        console.error('Failed to load recent clients:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadRecentClients()
  }, [])

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
        <Link className="border-0 bg-transparent text-[11px] font-bold text-blue-700 no-underline hover:text-blue-800" to="/clients">
          View all clients
        </Link>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-8 bg-slate-200 rounded"></div></td>
                </tr>
              ))
            ) : clients.map((client) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={client.id}
              >
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2.5 font-bold text-slate-700">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-600">
                      {client.name.substring(0, 2).toUpperCase()}
                    </span>
                    <span>{client.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <div className="grid gap-0.5 text-slate-600">
                    <span>{client.website || 'No contact info'}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  {client.owner?.name || 'Unassigned'}
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                  ${client.value?.toLocaleString() || 0}
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[client.status] || 'bg-slate-100 text-slate-600')}>
                    {client.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                  <ActionDropdown
                    label="..."
                    buttonClassName="border-0 bg-transparent px-1 py-0 text-[15px] leading-none text-slate-400 hover:border-0"
                  >
                    {['Open profile', 'Create task', 'Log activity'].map((action) => (
                      <button
                        className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                        key={action}
                        type="button"
                        onClick={() => setClientAction({ action, client })}
                      >
                        {action}
                      </button>
                    ))}
                  </ActionDropdown>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {clientAction && (
        <ActionModal
          title={clientAction.action}
          description={`${clientAction.client.company} - ${clientAction.client.contact}`}
          primaryLabel="Done"
          onClose={() => setClientAction(null)}
        >
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="m-0 text-sm font-bold text-slate-700">{clientAction.client.company}</p>
            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
              This action is currently unavailable. Detailed profile and workflow actions will be rolled out soon.
            </span>
          </div>
        </ActionModal>
      )}
    </section>
  )
}

export default RecentClients
