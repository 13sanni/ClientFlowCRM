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
  Active: 'green',
  Proposal: 'blue',
  'New lead': 'violet',
  'Follow-up': 'amber',
}

function ClientsPage() {
  return (
    <main className="app-content">
      <div className="page-header">
        <div>
          <p className="app-content__eyebrow">Accounts</p>
          <h1>Clients</h1>
        </div>
        <button className="page-header__action" type="button">
          Add client
        </button>
      </div>

      <section className="client-summary-grid" aria-label="Client summary">
        {clientSummary.map((item) => (
          <article className="client-summary-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="client-directory" aria-labelledby="client-directory-title">
        <div className="client-directory__toolbar">
          <div>
            <p className="panel-heading__eyebrow">Directory</p>
            <h2 id="client-directory-title">Client accounts</h2>
          </div>
          <div className="client-directory__filters">
            <button type="button">All segments</button>
            <button type="button">Status</button>
          </div>
        </div>

        <div className="clients-table-wrap">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Segment</th>
                <th>Owner</th>
                <th>Deal value</th>
                <th>Status</th>
                <th>Last contact</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.company}>
                  <td className="clients-table__value">{client.company}</td>
                  <td>{client.segment}</td>
                  <td>{client.owner}</td>
                  <td className="clients-table__value">{client.value}</td>
                  <td>
                    <span className={`client-status client-status--${statusTone[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{client.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default ClientsPage
