import { z } from 'zod'

const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE'])
const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const taskIdParamsSchema = z.object({
  taskId: z.string().min(1, 'Task id is required'),
})

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(1000).default(10),
  search: z.string().trim().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().trim().optional(),
  clientId: z.string().trim().optional(),
  dealId: z.string().trim().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
})

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Task title must be at least 2 characters'),
  description: z.string().trim().optional(),
  status: taskStatusSchema.default('TODO'),
  priority: taskPrioritySchema.default('MEDIUM'),
  dueDate: z.coerce.date().optional(),
  clientId: z.string().trim().optional(),
  dealId: z.string().trim().optional(),
  assigneeId: z.string().trim().optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
})

export const assignTaskSchema = z.object({
  assigneeId: z.string().trim().min(1, 'Assignee id is required'),
})

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
export type AssignTaskInput = z.infer<typeof assignTaskSchema>
