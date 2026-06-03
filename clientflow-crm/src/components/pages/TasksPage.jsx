import { useState } from 'react'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'

const taskSummary = [
  { label: 'Open tasks', value: '42' },
  { label: 'Due today', value: '9' },
  { label: 'Overdue', value: '3' },
]

const tasks = [
  {
    title: 'Send proposal revision',
    client: 'Clearline Media',
    owner: 'Jordan Davis',
    due: 'Today',
    priority: 'High',
    status: 'In progress',
  },
  {
    title: 'Prepare onboarding checklist',
    client: 'Northstar Labs',
    owner: 'Maya Patel',
    due: 'Tomorrow',
    priority: 'Medium',
    status: 'Queued',
  },
  {
    title: 'Review renewal terms',
    client: 'Vertex Systems',
    owner: 'Jordan Davis',
    due: 'Jun 6',
    priority: 'Medium',
    status: 'In review',
  },
  {
    title: 'Confirm discovery call',
    client: 'BrightPath Co.',
    owner: 'Maya Patel',
    due: 'Jun 8',
    priority: 'Low',
    status: 'Queued',
  },
  {
    title: 'Follow up on unpaid invoice',
    client: 'Harbor & Pine',
    owner: 'Luis Garcia',
    due: 'Overdue',
    priority: 'High',
    status: 'Blocked',
  },
]

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-emerald-50 text-emerald-700',
}

const statusStyles = {
  'In progress': 'bg-blue-50 text-blue-700',
  Queued: 'bg-slate-100 text-slate-600',
  'In review': 'bg-violet-50 text-violet-700',
  Blocked: 'bg-red-50 text-red-700',
}

function TasksPage() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)

  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Work management
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Tasks</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
          onClick={() => setIsNewTaskOpen(true)}
        >
          New task
        </button>
      </div>

      <section
        className="mt-6 grid grid-cols-3 gap-3.5 max-[520px]:grid-cols-1"
        aria-label="Task summary"
      >
        {taskSummary.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4" key={item.label}>
            <p className="m-0 text-xs font-bold text-slate-500">{item.label}</p>
            <strong className="mt-3 block text-2xl text-slate-900">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white" aria-labelledby="tasks-list-title">
        <div className="flex items-center justify-between gap-3 px-5 py-4 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
              Queue
            </p>
            <h2 id="tasks-list-title" className="mt-1 text-base font-bold text-slate-700">
              Task list
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              All owners
            </button>
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300"
              type="button"
            >
              Priority
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr>
                {['Task', 'Client', 'Owner', 'Due', 'Priority', 'Status'].map((heading) => (
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
              {tasks.map((task) => (
                <tr key={task.title}>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                    {task.title}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {task.client}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    {task.owner}
                  </td>
                  <td
                    className={cn(
                      'whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold',
                      task.due === 'Overdue' ? 'text-red-600' : 'text-slate-500',
                    )}
                  >
                    {task.due}
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', priorityStyles[task.priority])}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                    <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[task.status])}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isNewTaskOpen && (
        <ActionModal
          title="New task"
          description="Assign work to a teammate. This form is ready for validation wiring later."
          primaryLabel="Create task"
          onClose={() => setIsNewTaskOpen(false)}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Task title</span>
            <input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300" placeholder="Follow up with client" />
          </label>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Owner</span>
              <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
                <option>Jordan Davis</option>
                <option>Maya Patel</option>
                <option>Luis Garcia</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Priority</span>
              <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
          </div>
        </ActionModal>
      )}
    </main>
  )
}

export default TasksPage
