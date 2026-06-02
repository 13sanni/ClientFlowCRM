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
    <main className="app-content">
      <div className="page-header">
        <div>
          <p className="app-content__eyebrow">Sales pipeline</p>
          <h1>Deals</h1>
        </div>
        <button className="page-header__action" type="button">
          New deal
        </button>
      </div>

      <section className="client-summary-grid" aria-label="Deal summary">
        {dealSummary.map((item) => (
          <article className="client-summary-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="deals-board" aria-label="Deal pipeline board">
        {stages.map((stage) => (
          <article className="deal-column" key={stage.name}>
            <div className="deal-column__header">
              <div>
                <h2>{stage.name}</h2>
                <span>{stage.deals.length} deals</span>
              </div>
              <strong>{stage.value}</strong>
            </div>

            <div className="deal-column__cards">
              {stage.deals.map((deal) => (
                <article className="deal-card" key={deal.title}>
                  <div className="deal-card__header">
                    <h3>{deal.title}</h3>
                    <span>{deal.value}</span>
                  </div>
                  <p>{deal.company}</p>
                  <div className="deal-card__meta">
                    <span>{deal.owner}</span>
                    <time>Close {deal.closeDate}</time>
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
