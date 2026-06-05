import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import type {
  CreateDealInput,
  ListDealsQuery,
  MoveDealStageInput,
  UpdateDealInput,
} from './deal.schemas.js'
import * as dealService from './deal.service.js'

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

export const listStages: RequestHandler = async (req, res, next) => {
  try {
    const stages = await dealService.listPipelineStages(getWorkspaceId(req))

    res.status(200).json({ stages })
  } catch (error) {
    next(error)
  }
}

export const listDeals: RequestHandler = async (req, res, next) => {
  try {
    const result = await dealService.listDeals(getWorkspaceId(req), req.validatedQuery as ListDealsQuery)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getDeal: RequestHandler = async (req, res, next) => {
  try {
    const { dealId } = req.validatedParams as { dealId: string }
    const deal = await dealService.getDeal(getWorkspaceId(req), dealId)

    res.status(200).json({ deal })
  } catch (error) {
    next(error)
  }
}

export const createDeal: RequestHandler = async (req, res, next) => {
  try {
    const deal = await dealService.createDeal(getWorkspaceId(req), req.validatedBody as CreateDealInput)

    res.status(201).json({ deal })
  } catch (error) {
    next(error)
  }
}

export const updateDeal: RequestHandler = async (req, res, next) => {
  try {
    const { dealId } = req.validatedParams as { dealId: string }
    const deal = await dealService.updateDeal(
      getWorkspaceId(req),
      dealId,
      req.validatedBody as UpdateDealInput,
    )

    res.status(200).json({ deal })
  } catch (error) {
    next(error)
  }
}

export const moveDealStage: RequestHandler = async (req, res, next) => {
  try {
    const { dealId } = req.validatedParams as { dealId: string }
    const deal = await dealService.moveDealStage(
      getWorkspaceId(req),
      dealId,
      getUserId(req),
      req.validatedBody as MoveDealStageInput,
    )

    res.status(200).json({ deal })
  } catch (error) {
    next(error)
  }
}

export const deleteDeal: RequestHandler = async (req, res, next) => {
  try {
    const { dealId } = req.validatedParams as { dealId: string }

    await dealService.deleteDeal(getWorkspaceId(req), dealId)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
