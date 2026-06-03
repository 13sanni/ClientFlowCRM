const dealSummary = [
  { label: 'Open deals', value: '32' },
  { label: 'Pipeline value', value: '$86.4K' },
  { label: 'Avg. close time', value: '18d' },
]

const stages = [
  {
    name: 'Qualified',
    value: '$32,640',
    deals: [
      {
        title: 'Northstar expansion',
        company: 'Northstar Labs',
        owner: 'Maya Patel',
        value: '$18,400',
        closeDate: 'Jun 12',
      },
      {
        title: 'Vertex security audit',
        company: 'Vertex Systems',
        owner: 'Jordan Davis',
        value: '$14,240',
        closeDate: 'Jun 18',
      },
    ],
  },
  {
    name: 'Proposal',
    value: '$24,300',
    deals: [
      {
        title: 'Media buying suite',
        company: 'Clearline Media',
        owner: 'Jordan Davis',
        value: '$12,750',
        closeDate: 'Jun 10',
      },
      {
        title: 'Workflow automation',
        company: 'Harbor & Pine',
        owner: 'Luis Garcia',
        value: '$11,550',
        closeDate: 'Jun 21',
      },
    ],
  },
  {
    name: 'Negotiation',
    value: '$18,520',
    deals: [
      {
        title: 'Customer success retainer',
        company: 'BrightPath Co.',
        owner: 'Maya Patel',
        value: '$9,860',
        closeDate: 'Jun 15',
      },
      {
        title: 'Analytics rollout',
        company: 'Frostbyte Apps',
        owner: 'Jordan Davis',
        value: '$8,660',
        closeDate: 'Jun 22',
      },
    ],
  },
  {
    name: 'Closing',
    value: '$10,960',
    deals: [
      {
        title: 'Renewal package',
        company: 'Atlas Finance',
        owner: 'Luis Garcia',
        value: '$10,960',
        closeDate: 'Jun 7',
      },
    ],
  },
]

function DealsPage() {
  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Sales pipeline
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Deals</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
        >
          New deal
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Deal summary"
      >
        {dealSummary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
          </article>
        ))}
      </section>

      <section
        className="mt-4 grid grid-cols-4 gap-3.5 overflow-x-auto pb-1 max-[520px]:grid-cols-1 max-[520px]:overflow-x-visible"
        aria-label="Deal pipeline board"
      >
        {stages.map((stage) => (
          <article
            className="min-h-[420px] min-w-60 rounded-lg border border-slate-200 bg-slate-50 max-[520px]:min-h-0"
            key={stage.name}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
              <div>
                <h2 className="m-0 text-sm font-bold text-slate-700">{stage.name}</h2>
                <span className="mt-1 block text-[10px] font-bold text-slate-400">
                  {stage.deals.length} deals
                </span>
              </div>
              <strong className="text-xs text-slate-600">{stage.value}</strong>
            </div>

            <div className="grid gap-2.5 p-3">
              {stage.deals.map((deal) => (
                <article className="rounded-lg border border-slate-200 bg-white p-3" key={deal.title}>
                  <div className="flex items-start justify-between gap-2.5">
                    <h3 className="m-0 text-[13px] font-bold leading-snug text-slate-700">
                      {deal.title}
                    </h3>
                    <span className="whitespace-nowrap text-xs font-bold text-blue-700">{deal.value}</span>
                  </div>
                  <p className="mt-2 text-[11px] font-bold text-slate-500">{deal.company}</p>
                  <div className="mt-4 flex items-center justify-between gap-2.5 text-[10px] font-bold text-slate-400">
                    <span>{deal.owner}</span>
                    <time className="whitespace-nowrap">Close {deal.closeDate}</time>
                  </div>
                </article>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default DealsPage
