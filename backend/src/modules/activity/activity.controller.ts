import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import type { ListActivityQuery } from './activity.schemas.js'
import * as activityService from './activity.service.js'

function getWorkspaceId(req: Parameters<RequestHandler>[0]) {
  if (!req.auth?.workspaceId) {
    throw new HttpError(400, 'Workspace id is required')
  }

  return req.auth.workspaceId
}

export const listActivity: RequestHandler = async (req, res, next) => {
  try {
    const result = await activityService.listActivity(
      getWorkspaceId(req),
      req.validatedQuery as ListActivityQuery,
    )

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
