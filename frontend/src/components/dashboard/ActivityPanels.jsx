import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'
import { formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns'

const priorityStyles = {
  HIGH: 'bg-red-50 text-red-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-emerald-50 text-emerald-700',
}

function formatTaskDate(dateString) {
  if (!dateString) return 'No due date'
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isPast(date)) return 'Overdue'
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatActivityAction(action) {
  return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function formatActivityDetail(activity) {
  if (activity.action.includes('CREATED')) return `New ${activity.entityType.toLowerCase()} was created.`
  if (activity.action.includes('UPDATED')) return `${activity.entityType} was updated.`
  if (activity.action.includes('DELETED')) return `${activity.entityType} was deleted.`
  if (activity.action.includes('STAGE_CHANGED')) return `Moved from ${activity.metadata?.from || 'unknown'} to ${activity.metadata?.to || 'unknown'}.`
  return `Activity logged for ${activity.entityType}.`
}

function ActivityPanels() {
  const [modal, setModal] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPanels() {
      try {
        setIsLoading(true)
        const [tasksRes, activitiesRes] = await Promise.all([
          api.get('/tasks?page=1&pageSize=5'),
          api.get('/activity?page=1&pageSize=5')
        ])
        setTasks(tasksRes.items || [])
        setActivities(activitiesRes.items || [])
      } catch (err) {
        console.error('Failed to load activity panels:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPanels()
  }, [])

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
            onClick={() => setModal('task')}
          >
            Add task
          </button>
        </div>

        <div className="grid border-t border-slate-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-t border-slate-100 px-5 py-3 animate-pulse">
                <div className="h-4 w-4 rounded bg-slate-200 shrink-0"></div>
                <div className="grid gap-1.5 flex-1">
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                  <div className="h-2 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-12 rounded-full bg-slate-200 shrink-0"></div>
              </div>
            ))
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <label
                className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-slate-100 px-5 py-3 first:border-t-0 hover:bg-slate-50"
                key={task.id}
              >
                <input className="h-4 w-4 accent-blue-600" type="checkbox" />
                <span className="grid min-w-0 gap-0.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-slate-700">
                    {task.title}
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold text-slate-400">
                    {task.client?.name || 'No Client'} · Due {formatTaskDate(task.dueDate)}
                  </span>
                </span>
                <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', priorityStyles[task.priority] || 'bg-slate-100 text-slate-600')}>
                  {task.priority?.charAt(0) + task.priority?.slice(1).toLowerCase()}
                </span>
              </label>
            ))
          ) : (
            <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
              No tasks in the queue.
            </div>
          )}
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
            onClick={() => setModal('log')}
          >
            View log
          </button>
        </div>

        <ol className="m-0 grid list-none border-t border-slate-100 p-0">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-t border-slate-100 px-5 py-4 animate-pulse" key={i}>
                <div className="mt-1.5 h-2 w-2 rounded-full bg-slate-200 shrink-0"></div>
                <div className="grid gap-1.5">
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                  <div className="h-2 w-48 bg-slate-200 rounded"></div>
                </div>
                <div className="h-3 w-12 bg-slate-200 rounded shrink-0"></div>
              </li>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <li
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-t border-slate-100 px-5 py-4 first:border-t-0 hover:bg-slate-50"
                key={activity.id}
              >
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="m-0 text-xs font-bold text-slate-700">{formatActivityAction(activity.action)}</p>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                    {formatActivityDetail(activity)}
                  </span>
                </div>
                <time className="whitespace-nowrap text-[10px] font-bold text-slate-400">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </time>
              </li>
            ))
          ) : (
            <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
              No recent activity.
            </div>
          )}
        </ol>
      </article>

      {modal === 'task' && (
        <ActionModal
          title="Add dashboard task"
          description="Create a quick task from the dashboard queue."
          primaryLabel="Add task"
          onClose={() => setModal(null)}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Task title</span>
            <input
              className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
              placeholder="Call client"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Priority</span>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
        </ActionModal>
      )}

      {modal === 'log' && (
        <ActionModal
          title="Activity log"
          description="Recent CRM updates and audit trail."
          primaryLabel="Close"
          onClose={() => setModal(null)}
        >
          {activities.map((activity) => (
            <div className="rounded-md border border-slate-100 p-3" key={activity.title}>
              <p className="m-0 text-xs font-bold text-slate-700">{activity.title}</p>
              <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                {activity.detail}
              </span>
            </div>
          ))}
        </ActionModal>
      )}
    </section>
  )
}

export default ActivityPanels
