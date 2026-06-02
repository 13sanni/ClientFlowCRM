const tasks = [
  {
    title: 'Send proposal revision',
    account: 'Clearline Media',
    due: 'Today',
    priority: 'High',
    tone: 'red',
  },
  {
    title: 'Prepare onboarding checklist',
    account: 'Northstar Labs',
    due: 'Tomorrow',
    priority: 'Medium',
    tone: 'amber',
  },
  {
    title: 'Review renewal terms',
    account: 'Vertex Systems',
    due: 'Jun 6',
    priority: 'Medium',
    tone: 'amber',
  },
  {
    title: 'Confirm discovery call',
    account: 'BrightPath Co.',
    due: 'Jun 8',
    priority: 'Low',
    tone: 'green',
  },
]

const activities = [
  {
    title: 'Deal moved to negotiation',
    detail: 'Vertex Systems advanced after pricing review.',
    time: '18 min ago',
  },
  {
    title: 'New client note added',
    detail: 'Jordan added meeting notes for Harbor & Pine.',
    time: '52 min ago',
  },
  {
    title: 'Invoice marked paid',
    detail: 'Northstar Labs paid invoice INV-1048.',
    time: '2 hr ago',
  },
  {
    title: 'Follow-up scheduled',
    detail: 'BrightPath Co. callback set for Friday.',
    time: 'Yesterday',
  },
]

function ActivityPanels() {
  return (
    <section className="activity-grid" aria-label="Tasks and recent activity">
      <article className="tasks-panel">
        <div className="dashboard-panel__heading">
          <div>
            <p className="panel-heading__eyebrow">Work queue</p>
            <h2>Priority tasks</h2>
          </div>
          <button className="dashboard-panel__action" type="button">
            Add task
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map((task) => (
            <label className="task-item" key={task.title}>
              <input type="checkbox" />
              <span className="task-item__content">
                <span className="task-item__title">{task.title}</span>
                <span className="task-item__meta">
                  {task.account} · Due {task.due}
                </span>
              </span>
              <span className={`task-priority task-priority--${task.tone}`}>{task.priority}</span>
            </label>
          ))}
        </div>
      </article>

      <article className="activity-panel">
        <div className="dashboard-panel__heading">
          <div>
            <p className="panel-heading__eyebrow">Timeline</p>
            <h2>Recent activity</h2>
          </div>
          <button className="dashboard-panel__action" type="button">
            View log
          </button>
        </div>

        <ol className="activity-list">
          {activities.map((activity) => (
            <li className="activity-item" key={activity.title}>
              <span className="activity-item__dot" aria-hidden="true" />
              <div>
                <p>{activity.title}</p>
                <span>{activity.detail}</span>
              </div>
              <time>{activity.time}</time>
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}

export default ActivityPanels
