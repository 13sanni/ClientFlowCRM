const helpTopics = [
  {
    title: 'Getting started',
    description: 'Set up your workspace, invite teammates, and configure your first pipeline.',
  },
  {
    title: 'Pipeline management',
    description: 'Learn how to track leads, move deals, and review conversion performance.',
  },
  {
    title: 'Billing workflow',
    description: 'Manage invoices, payment states, and overdue account follow-ups.',
  },
]

const supportOptions = [
  { label: 'Documentation', value: 'Browse CRM guides' },
  { label: 'Support inbox', value: 'Average reply: 4h' },
  { label: 'System status', value: 'All services operational' },
]

function HelpCenterPage() {
  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Support
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Help center</h1>
        </div>
        <button
          className="rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-300"
          type="button"
        >
          Contact support
        </button>
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-1" aria-label="Support options">
        {supportOptions.map((option) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={option.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{option.label}</p>
            <strong className="mt-3 block text-base text-slate-900">{option.value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white" aria-labelledby="help-topics-title">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Knowledge base
          </p>
          <h2 id="help-topics-title" className="mt-1 text-base font-bold text-slate-700">
            Common topics
          </h2>
        </div>

        <div className="grid divide-y divide-slate-100">
          {helpTopics.map((topic) => (
            <article className="flex items-start justify-between gap-4 px-5 py-4 max-[520px]:flex-col" key={topic.title}>
              <div>
                <h3 className="m-0 text-sm font-bold text-slate-700">{topic.title}</h3>
                <p className="mt-1 max-w-2xl text-xs font-semibold leading-5 text-slate-400">
                  {topic.description}
                </p>
              </div>
              <button
                className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
                type="button"
              >
                Open guide
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HelpCenterPage
