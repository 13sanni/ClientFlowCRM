import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ActionDropdown from '../common/ActionDropdown'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'
import { format, parseISO } from 'date-fns'

const createInvoiceSchema = z.object({
  invoiceNo: z.string().trim().min(2, 'Invoice # required'),
  amount: z.coerce.number().min(0, 'Invalid amount').default(0),
  clientId: z.string().min(1, 'Client required'),
  dueAt: z.string().optional(),
})

const statusStyles = {
  PAID: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  OVERDUE: 'bg-red-50 text-red-700',
  DRAFT: 'bg-slate-100 text-slate-600',
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return format(parseISO(dateString), 'MMM d')
}

function InvoicesPage() {
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [dateFilter, setDateFilter] = useState('Date range')

  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { invoiceNo: '', amount: 0, clientId: '', dueAt: '' }
  })

  async function loadData() {
    try {
      setIsLoading(true)
      const [invRes, clientRes] = await Promise.all([
        api.get('/invoices?page=1&pageSize=100'),
        api.get('/clients?page=1&pageSize=100')
      ])
      setInvoices(invRes.items || [])
      setClients(clientRes.items || [])
    } catch (err) {
      console.error('Failed to load invoices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onCreateInvoice = async (data) => {
    try {
      await api.post('/invoices', {
        ...data,
        dueAt: data.dueAt ? new Date(data.dueAt).toISOString() : undefined
      })
      setIsCreateInvoiceOpen(false)
      reset()
      loadData()
    } catch (err) {
      console.error('Failed to create invoice:', err)
      alert(err.message || 'Failed to create invoice')
    }
  }

  const { filteredInvoices, summary } = useMemo(() => {
    let totalBilled = 0
    let paidCount = 0
    let overdueAmount = 0

    const filtered = invoices.filter(inv => {
      // Summary calculations
      if (inv.status === 'PAID') {
        paidCount++
        totalBilled += (Number(inv.amount) || 0)
      } else if (inv.status === 'OVERDUE') {
        overdueAmount += (Number(inv.amount) || 0)
      } else if (inv.status === 'PENDING') {
        totalBilled += (Number(inv.amount) || 0)
      }

      const matchStatus = statusFilter === 'All statuses' || inv.status === statusFilter.toUpperCase()
      return matchStatus
    })

    return {
      filteredInvoices: filtered,
      summary: [
        { label: 'Total billed', value: `$${(totalBilled / 1000).toFixed(1)}k` },
        { label: 'Paid invoices', value: paidCount.toString() },
        { label: 'Overdue', value: `$${(overdueAmount / 1000).toFixed(1)}k` },
      ]
    }
  }, [invoices, statusFilter])

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7"
    >
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Billing
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Invoices</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
          onClick={() => setIsCreateInvoiceOpen(true)}
        >
          Create invoice
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Invoice summary"
      >
        {summary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white" aria-labelledby="invoice-list-title">
        <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
              Receivables
            </p>
            <h2 id="invoice-list-title" className="mt-1 text-base font-bold text-slate-700">
              Invoice list
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionDropdown label={statusFilter}>
              {['All statuses', 'Paid', 'Pending', 'Overdue', 'Draft'].map((status) => (
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
            <ActionDropdown label={dateFilter}>
              {['Date range', 'Last 7 days', 'This month', 'This quarter'].map((range) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={range}
                  type="button"
                  onClick={() => setDateFilter(range)}
                >
                  {range}
                </button>
              ))}
            </ActionDropdown>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr>
                {['Invoice', 'Client', 'Issued', 'Due', 'Amount', 'Status'].map((heading) => (
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
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full"></div></td>
                  </tr>
                ))
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key={invoice.id}
                  >
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      {invoice.invoiceNo}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {invoice.client?.name || 'Unknown Client'}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {formatDate(invoice.issuedAt)}
                    </td>
                    <td
                      className={cn(
                        'whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold',
                        invoice.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-500',
                      )}
                    >
                      {formatDate(invoice.dueAt)}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      ${Number(invoice.amount || 0).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[invoice.status] || 'bg-slate-100 text-slate-600')}>
                        {invoice.status?.charAt(0) + invoice.status?.slice(1).toLowerCase()}
                      </span>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700">No invoices found</p>
                      <p className="text-xs text-slate-500">Create an invoice or adjust your filters.</p>
                      <button
                        className="mt-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        onClick={() => { setStatusFilter('All statuses'); setDateFilter('Date range'); }}
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

      {isCreateInvoiceOpen && (
        <ActionModal
          title="Create invoice"
          description="Draft an invoice for a client."
          primaryLabel="Create invoice"
          onClose={() => setIsCreateInvoiceOpen(false)}
          onSubmit={handleSubmit(onCreateInvoice)}
          isSubmitting={isSubmitting}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Invoice Number</span>
            <input
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.invoiceNo ? "border-red-300" : "border-slate-200")}
              placeholder="INV-001"
              {...register('invoiceNo')}
            />
            {errors.invoiceNo && <span className="text-[10px] text-red-600">{errors.invoiceNo.message}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Client</span>
            <select
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.clientId ? "border-red-300" : "border-slate-200")}
              {...register('clientId')}
            >
              <option value="">Select a client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <span className="text-[10px] text-red-600">{errors.clientId.message}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Amount ($)</span>
              <input
                type="number"
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.amount ? "border-red-300" : "border-slate-200")}
                placeholder="5000"
                {...register('amount')}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Due date</span>
              <input
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.dueAt ? "border-red-300" : "border-slate-200")}
                type="date"
                {...register('dueAt')}
              />
            </label>
          </div>
        </ActionModal>
      )}
    </motion.main>
  )
}

export default InvoicesPage
