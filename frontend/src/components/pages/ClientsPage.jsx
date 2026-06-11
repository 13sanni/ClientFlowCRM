import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ActionDropdown from '../common/ActionDropdown'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'
import { formatDistanceToNow } from 'date-fns'

const createClientSchema = z.object({
  name: z.string().trim().min(2, 'Company name is required'),
  segment: z.string().optional(),
  contactEmail: z.string().trim().email('Invalid email').optional().or(z.literal('')),
})

const statusTone = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  PROPOSAL: 'bg-blue-50 text-blue-700',
  NEW_LEAD: 'bg-violet-50 text-violet-700',
  FOLLOW_UP: 'bg-amber-50 text-amber-700',
}

const segmentMap = {
  ENTERPRISE: 'Enterprise',
  MID_MARKET: 'Mid-market',
  STARTUP: 'Startup',
  SMALL_BUSINESS: 'Small business'
}

function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [segmentFilter, setSegmentFilter] = useState('All segments')
  const [statusFilter, setStatusFilter] = useState('Status')
  
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: '', segment: 'STARTUP', contactEmail: '' }
  })

  async function loadClients() {
    try {
      setIsLoading(true)
      const response = await api.get('/clients?page=1&pageSize=50')
      setClients(response.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const onAddClient = async (data) => {
    try {
      await api.post('/clients', {
        name: data.name,
        segment: data.segment,
        primaryContact: data.contactEmail ? { name: 'Primary Contact', email: data.contactEmail } : undefined
      })
      setIsAddClientOpen(false)
      reset()
      loadClients()
    } catch (err) {
      console.error('Failed to add client:', err)
      alert(err.message || 'Failed to add client')
    }
  }

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSegment = segmentFilter === 'All segments' || segmentMap[client.segment] === segmentFilter
      const matchStatus = statusFilter === 'Status' || client.status === statusFilter.toUpperCase().replace(' ', '_')
      return matchSegment && matchStatus
    })
  }, [clients, segmentFilter, statusFilter])

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7"
    >
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
          <div className="flex flex-wrap gap-2">
            <ActionDropdown label={segmentFilter}>
              {['All segments', 'Enterprise', 'Mid-market', 'Startup', 'Small business'].map((segment) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={segment}
                  type="button"
                  onClick={() => setSegmentFilter(segment)}
                >
                  {segment}
                </button>
              ))}
            </ActionDropdown>
            <ActionDropdown label={statusFilter}>
              {['Status', 'Active', 'Proposal', 'New lead', 'Follow-up'].map((status) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </ActionDropdown>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-4 w-32 rounded bg-slate-200"></div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-4 w-24 rounded bg-slate-200"></div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-4 w-28 rounded bg-slate-200"></div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-4 w-16 rounded bg-slate-200"></div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-5 w-20 rounded-full bg-slate-200"></div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4">
                      <div className="h-4 w-24 rounded bg-slate-200"></div>
                    </td>
                  </tr>
                ))
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    key={client.company}
                  >
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      {client.name}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {segmentMap[client.segment] || client.segment}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {client.owner?.name || 'Unassigned'}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      ${client.value?.toLocaleString() || 0}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusTone[client.status] || 'bg-slate-100 text-slate-600')}>
                        {client.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {client.updatedAt ? formatDistanceToNow(new Date(client.updatedAt), { addSuffix: true }) : 'Never'}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border-t border-slate-100 px-5 py-16 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-50">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700">No clients found</p>
                      <p className="text-xs text-slate-500">Adjust your filters or add a new client to get started.</p>
                      <button
                        className="mt-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        onClick={() => { setSegmentFilter('All segments'); setStatusFilter('Status'); }}
                      >
                        Clear filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isAddClientOpen && (
        <ActionModal
          title="Add client"
          description="Capture a new account to begin tracking deals and tasks."
          primaryLabel="Add client"
          onClose={() => setIsAddClientOpen(false)}
          onSubmit={handleSubmit(onAddClient)}
          isSubmitting={isSubmitting}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Company name</span>
            <input 
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.name ? "border-red-300" : "border-slate-200")} 
              placeholder="Acme Corp" 
              {...register('name')}
            />
            {errors.name && <span className="text-[10px] text-red-600">{errors.name.message}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Contact email</span>
            <input 
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.contactEmail ? "border-red-300" : "border-slate-200")} 
              placeholder="name@company.com" 
              {...register('contactEmail')}
            />
            {errors.contactEmail && <span className="text-[10px] text-red-600">{errors.contactEmail.message}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Segment</span>
            <select 
              className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
              {...register('segment')}
            >
              <option value="STARTUP">Startup</option>
              <option value="SMALL_BUSINESS">Small Business</option>
              <option value="MID_MARKET">Mid-Market</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </label>
        </ActionModal>
      )}
    </motion.main>
  )
}

export default ClientsPage
