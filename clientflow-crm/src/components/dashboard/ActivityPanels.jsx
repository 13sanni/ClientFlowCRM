import { cn } from '../../lib/utils'

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

const priorityStyles = {
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
}

function ActivityPanels() {
  return (
    <section
      className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 max-[1100px]:grid-cols-1"
      aria-label="Tasks and recent activity"
    >
      <article className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
              Work queue
            </p>
            <h2 className="mt-1 text-base font-bold tracking-normal text-slate-700">Priority tasks</h2>
          </div>
          <button
            className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
            type="button"
          >
            Add task
          </button>
        </div>

        <div className="grid border-t border-slate-100">
          {tasks.map((task) => (
            <label
              className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-slate-100 px-5 py-3 first:border-t-0"
              key={task.title}
            >
              <input className="h-4 w-4 accent-blue-600" type="checkbox" />
              <span className="grid min-w-0 gap-0.5">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-slate-700">
                  {task.title}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold text-slate-400">
                  {task.account} · Due {task.due}
                </span>
              </span>
              <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', priorityStyles[task.tone])}>
                {task.priority}
              </span>
            </label>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">Timeline</p>
            <h2 className="mt-1 text-base font-bold tracking-normal text-slate-700">Recent activity</h2>
          </div>
          <button
            className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
            type="button"
          >
            View log
          </button>
        </div>

        <ol className="m-0 grid list-none border-t border-slate-100 p-0">
          {activities.map((activity) => (
            <li
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-t border-slate-100 px-5 py-4 first:border-t-0"
              key={activity.title}
            >
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
              <div>
                <p className="m-0 text-xs font-bold text-slate-700">{activity.title}</p>
                <span className="mt-1 block text-[11px] font-semibold text-slate-400">{activity.detail}</span>
              </div>
              <time className="whitespace-nowrap text-[10px] font-bold text-slate-400">{activity.time}</time>
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}

export default ActivityPanels
