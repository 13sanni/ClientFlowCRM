import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import type {
  AssignTaskInput,
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from './task.schemas.js'
import * as taskService from './task.service.js'

function getWorkspaceId(req: Parameters<RequestHandler>[0]) {
  if (!req.auth?.workspaceId) {
    throw new HttpError(400, 'Workspace id is required')
  }

  return req.auth.workspaceId
}

function getUserId(req: Parameters<RequestHandler>[0]) {
  if (!req.auth?.userId) {
    throw new HttpError(401, 'Authentication required')
  }

  return req.auth.userId
}

export const listTasks: RequestHandler = async (req, res, next) => {
  try {
    const result = await taskService.listTasks(getWorkspaceId(req), req.validatedQuery as ListTasksQuery)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.validatedParams as { taskId: string }
    const task = await taskService.getTask(getWorkspaceId(req), taskId)

    res.status(200).json({ task })
  } catch (error) {
    next(error)
  }
}

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      getWorkspaceId(req),
      getUserId(req),
      req.validatedBody as CreateTaskInput,
    )

    res.status(201).json({ task })
  } catch (error) {
    next(error)
  }
}

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.validatedParams as { taskId: string }
    const task = await taskService.updateTask(
      getWorkspaceId(req),
      taskId,
      getUserId(req),
      req.validatedBody as UpdateTaskInput,
    )

    res.status(200).json({ task })
  } catch (error) {
    next(error)
  }
}

export const updateTaskStatus: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.validatedParams as { taskId: string }
    const task = await taskService.updateTaskStatus(
      getWorkspaceId(req),
      taskId,
      getUserId(req),
      req.validatedBody as UpdateTaskStatusInput,
    )

    res.status(200).json({ task })
  } catch (error) {
    next(error)
  }
}

export const assignTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.validatedParams as { taskId: string }
    const task = await taskService.assignTask(
      getWorkspaceId(req),
      taskId,
      getUserId(req),
      req.validatedBody as AssignTaskInput,
    )

    res.status(200).json({ task })
  } catch (error) {
    next(error)
  }
}

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.validatedParams as { taskId: string }

    await taskService.deleteTask(getWorkspaceId(req), taskId, getUserId(req))

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
