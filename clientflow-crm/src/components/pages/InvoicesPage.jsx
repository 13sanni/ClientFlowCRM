import { useState } from 'react'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'

const invoiceSummary = [
  { label: 'Total billed', value: '$48.9K' },
  { label: 'Paid invoices', value: '38' },
  { label: 'Overdue', value: '$4.2K' },
]

const invoices = [
  {
    id: 'INV-1048',
    client: 'Northstar Labs',
    issued: 'May 28',
    due: 'Jun 7',
    amount: '$8,400',
    status: 'Paid',
  },
  {
    id: 'INV-1049',
    client: 'Clearline Media',
    issued: 'May 30',
    due: 'Jun 12',
    amount: '$6,750',
    status: 'Pending',
  },
  {
    id: 'INV-1050',
    client: 'Harbor & Pine',
    issued: 'May 18',
    due: 'May 31',
    amount: '$4,200',
    status: 'Overdue',
  },
  {
    id: 'INV-1051',
    client: 'Vertex Systems',
    issued: 'Jun 1',
    due: 'Jun 15',
    amount: '$11,300',
    status: 'Pending',
  },
  {
    id: 'INV-1052',
    client: 'BrightPath Co.',
    issued: 'Jun 2',
    due: 'Jun 20',
    amount: '$3,860',
    status: 'Draft',
  },
]

const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-red-50 text-red-700',
  Draft: 'bg-slate-100 text-slate-600',
}

function InvoicesPage() {
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)

  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
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
        {invoiceSummary.map((item) => (
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
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              All statuses
            </button>
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              Date range
            </button>
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
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                    {invoice.id}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {invoice.client}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {invoice.issued}
                  </td>
                  <td
                    className={cn(
                      'whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold',
                      invoice.status === 'Overdue' ? 'text-red-600' : 'text-slate-500',
                    )}
                  >
                    {invoice.due}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                    {invoice.amount}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[invoice.status])}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isCreateInvoiceOpen && (
        <ActionModal
          title="Create invoice"
          description="Draft an invoice for a client. Payment workflow will connect later."
          primaryLabel="Create invoice"
          onClose={() => setIsCreateInvoiceOpen(false)}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Client</span>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
              <option>Northstar Labs</option>
              <option>Clearline Media</option>
              <option>Vertex Systems</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Amount</span>
              <input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300" placeholder="$5,000" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Due date</span>
              <input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300" type="date" />
            </label>
          </div>
        </ActionModal>
      )}
    </main>
  )
}

export default InvoicesPage
