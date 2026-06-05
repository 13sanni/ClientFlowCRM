import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import type { CreateClientInput, ListClientsQuery, UpdateClientInput } from './client.schemas.js'
import * as clientService from './client.service.js'

function getWorkspaceId(req: Parameters<RequestHandler>[0]) {
  if (!req.auth?.workspaceId) {
    throw new HttpError(400, 'Workspace id is required')
  }

  return req.auth.workspaceId
}

export const listClients: RequestHandler = async (req, res, next) => {
  try {
    const result = await clientService.listClients(
      getWorkspaceId(req),
      req.validatedQuery as ListClientsQuery,
    )

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getClient: RequestHandler = async (req, res, next) => {
  try {
    const { clientId } = req.validatedParams as { clientId: string }
    const client = await clientService.getClient(getWorkspaceId(req), clientId)

    res.status(200).json({ client })
  } catch (error) {
    next(error)
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  try {
    const client = await clientService.createClient(
      getWorkspaceId(req),
      req.validatedBody as CreateClientInput,
    )

    res.status(201).json({ client })
  } catch (error) {
    next(error)
  }
}

export const updateClient: RequestHandler = async (req, res, next) => {
  try {
    const { clientId } = req.validatedParams as { clientId: string }
    const client = await clientService.updateClient(
      getWorkspaceId(req),
      clientId,
      req.validatedBody as UpdateClientInput,
    )

    res.status(200).json({ client })
  } catch (error) {
    next(error)
  }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
  try {
    const { clientId } = req.validatedParams as { clientId: string }

    await clientService.deleteClient(getWorkspaceId(req), clientId)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
