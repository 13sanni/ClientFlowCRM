import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ActionDropdown from '../common/ActionDropdown'
import ActionModal from '../common/ActionModal'
import { cn } from '../../lib/utils'
import { api } from '../../lib/api'
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns'

const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  clientId: z.string().optional().or(z.literal('')),
})

const priorityStyles = {
  HIGH: 'bg-red-50 text-red-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-emerald-50 text-emerald-700',
}

const statusStyles = {
  TODO: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  IN_REVIEW: 'bg-violet-50 text-violet-700',
  DONE: 'bg-emerald-50 text-emerald-700',
  BLOCKED: 'bg-red-50 text-red-700',
}

function formatTaskDate(dateString) {
  if (!dateString) return 'No due date'
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isPast(date)) return 'Overdue'
  return format(date, 'MMM d')
}

function TasksPage() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [ownerFilter, setOwnerFilter] = useState('All owners')
  const [priorityFilter, setPriorityFilter] = useState('Priority')

  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', priority: 'MEDIUM' }
  })

  async function loadData() {
    try {
      setIsLoading(true)
      const [tasksRes, clientsRes] = await Promise.all([
        api.get('/tasks?page=1&pageSize=1000'),
        api.get('/clients?page=1&pageSize=1000')
      ])
      setTasks(tasksRes.items || [])
      setClients(clientsRes.items || [])
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onAddTask = async (data) => {
    try {
      const payload = { ...data }
      if (!payload.clientId) delete payload.clientId

      await api.post('/tasks', payload)
      setIsNewTaskOpen(false)
      reset()
      loadData()
    } catch (err) {
      console.error('Failed to add task:', err)
      alert(err.message || 'Failed to add task')
    }
  }

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus })
    } catch (err) {
      console.error('Failed to update task status:', err)
      loadData() // Revert on failure
    }
  }

  const { filteredTasks, summary } = useMemo(() => {
    let openTasks = 0
    let dueToday = 0
    let overdue = 0

    const filtered = tasks.filter(task => {
      // Calculate summary
      if (task.status !== 'DONE') {
        openTasks++
        if (task.dueDate) {
          const d = parseISO(task.dueDate)
          if (isToday(d)) dueToday++
          else if (isPast(d)) overdue++
        }
      }

      const matchOwner = ownerFilter === 'All owners' || task.owner?.name === ownerFilter
      const matchPriority = priorityFilter === 'Priority' || task.priority === priorityFilter.toUpperCase()
      return matchOwner && matchPriority
    })

    return {
      filteredTasks: filtered,
      summary: [
        { label: 'Open tasks', value: openTasks.toString() },
        { label: 'Due today', value: dueToday.toString() },
        { label: 'Overdue', value: overdue.toString() },
      ]
    }
  }, [tasks, ownerFilter, priorityFilter])

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7"
    >
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
        {summary.map((item) => (
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
          <div className="flex flex-wrap gap-2">
            <ActionDropdown label={ownerFilter}>
              {['All owners', 'Jordan Davis', 'Maya Patel', 'Luis Garcia'].map((owner) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={owner}
                  type="button"
                  onClick={() => setOwnerFilter(owner)}
                >
                  {owner}
                </button>
              ))}
            </ActionDropdown>
            <ActionDropdown label={priorityFilter}>
              {['Priority', 'High', 'Medium', 'Low'].map((priority) => (
                <button
                  className="block w-full rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-100"
                  key={priority}
                  type="button"
                  onClick={() => setPriorityFilter(priority)}
                >
                  {priority}
                </button>
              ))}
            </ActionDropdown>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-40 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                  </tr>
                ))
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key={task.id}
                    className={task.status === 'DONE' ? 'opacity-50' : ''}
                  >
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={task.status === 'DONE'}
                          onChange={() => toggleTaskStatus(task)}
                        />
                        <span className={task.status === 'DONE' ? 'line-through' : ''}>{task.title}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {task.client?.name || 'No Client'}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      {task.owner?.name || 'Unassigned'}
                    </td>
                    <td
                      className={cn(
                        'whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold',
                        formatTaskDate(task.dueDate) === 'Overdue' ? 'text-red-600' : 'text-slate-500',
                      )}
                    >
                      {formatTaskDate(task.dueDate)}
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', priorityStyles[task.priority] || 'bg-slate-100 text-slate-600')}>
                        {task.priority?.charAt(0) + task.priority?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-t border-slate-100 px-5 py-3 text-xs font-semibold text-slate-500">
                      <span className={cn('inline-flex rounded-full px-2 py-1 text-[10px] font-bold', statusStyles[task.status] || 'bg-slate-100 text-slate-600')}>
                        {task.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border-t border-slate-100 px-5 py-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-50">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700">No tasks found</p>
                      <p className="text-xs text-slate-500">You're all caught up! Or try adjusting your filters.</p>
                      <button
                        className="mt-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        onClick={() => { setOwnerFilter('All owners'); setPriorityFilter('Priority'); }}
                      >
                        Clear filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isNewTaskOpen && (
        <ActionModal
          title="New task"
          description="Assign work to your team."
          primaryLabel="Create task"
          onClose={() => setIsNewTaskOpen(false)}
          onSubmit={handleSubmit(onAddTask)}
          isSubmitting={isSubmitting}
        >
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Task title</span>
            <input
              className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.title ? "border-red-300" : "border-slate-200")}
              placeholder="Follow up with client"
              {...register('title')}
            />
            {errors.title && <span className="text-[10px] text-red-600">{errors.title.message}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Priority</span>
              <select
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.priority ? "border-red-300" : "border-slate-200")}
                {...register('priority')}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Client</span>
              <select
                className={cn("rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-300", errors.clientId ? "border-red-300" : "border-slate-200")}
                {...register('clientId')}
              >
                <option value="">No Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
        </ActionModal>
      )}
    </motion.main>
  )
}

export default TasksPage
