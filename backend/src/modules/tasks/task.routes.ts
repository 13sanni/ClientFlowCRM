import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceManager, requireWorkspaceSalesRep } from '../../middleware/rbac.middleware.js'
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.middleware.js'
import * as taskController from './task.controller.js'
import {
  assignTaskSchema,
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from './task.schemas.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireWorkspaceSalesRep(), validateQuery(listTasksQuerySchema), taskController.listTasks)
router.post('/', requireWorkspaceSalesRep(), validateBody(createTaskSchema), taskController.createTask)
router.get(
  '/:taskId',
  requireWorkspaceSalesRep(),
  validateParams(taskIdParamsSchema),
  taskController.getTask,
)
router.patch(
  '/:taskId',
  requireWorkspaceSalesRep(),
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask,
)
router.patch(
  '/:taskId/status',
  requireWorkspaceSalesRep(),
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskStatusSchema),
  taskController.updateTaskStatus,
)
router.patch(
  '/:taskId/assignee',
  requireWorkspaceSalesRep(),
  validateParams(taskIdParamsSchema),
  validateBody(assignTaskSchema),
  taskController.assignTask,
)
router.delete(
  '/:taskId',
  requireWorkspaceManager(),
  validateParams(taskIdParamsSchema),
  taskController.deleteTask,
)

export default router
