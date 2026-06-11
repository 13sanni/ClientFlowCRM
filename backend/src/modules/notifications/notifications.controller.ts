import type { RequestHandler } from 'express'
import * as notificationsService from './notifications.service.js'
import { HttpError } from '../../utils/http-error.js'

export const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId
    const workspaceId = req.auth?.workspaceId

    if (!userId || !workspaceId) {
      throw new HttpError(401, 'Unauthorized')
    }

    const data = await notificationsService.getUserNotifications(userId, workspaceId)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

export const markAsRead: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId
    const workspaceId = req.auth?.workspaceId
    const { id } = req.params

    if (!userId || !workspaceId) {
      throw new HttpError(401, 'Unauthorized')
    }

    await notificationsService.markAsRead(id, userId, workspaceId)
    res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}

export const markAllAsRead: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId
    const workspaceId = req.auth?.workspaceId

    if (!userId || !workspaceId) {
      throw new HttpError(401, 'Unauthorized')
    }

    await notificationsService.markAllAsRead(userId, workspaceId)
    res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}
