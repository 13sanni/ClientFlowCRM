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

function RecentClients() {
  return (
    <section className="clients-panel" aria-labelledby="recent-clients-title">
      <div className="clients-panel__heading">
        <div>
          <p className="panel-heading__eyebrow">Client activity</p>
          <h2 id="recent-clients-title">Recent clients</h2>
        </div>
        <button className="clients-panel__view-all" type="button">
          View all clients
        </button>
      </div>

      <div className="clients-table-wrap">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Owner</th>
              <th>Deal value</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.company}>
                <td>
                  <div className="client-company">
                    <span className="client-company__avatar">{client.initials}</span>
                    <span>{client.company}</span>
                  </div>
                </td>
                <td>
                  <div className="client-contact">
                    <span>{client.contact}</span>
                    <small>{client.email}</small>
                  </div>
                </td>
                <td>{client.owner}</td>
                <td className="clients-table__value">{client.value}</td>
                <td>
                  <span className={`client-status client-status--${client.tone}`}>{client.status}</span>
                </td>
                <td>
                  <button className="clients-table__action" type="button" aria-label={`Open ${client.company}`}>
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
