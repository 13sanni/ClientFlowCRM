import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import type {
  CreateInvoiceInput,
  ListInvoicesQuery,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
} from './invoice.schemas.js'
import * as invoiceService from './invoice.service.js'

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

export const listInvoices: RequestHandler = async (req, res, next) => {
  try {
    const result = await invoiceService.listInvoices(
      getWorkspaceId(req),
      req.validatedQuery as ListInvoicesQuery,
    )

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getInvoice: RequestHandler = async (req, res, next) => {
  try {
    const { invoiceId } = req.validatedParams as { invoiceId: string }
    const invoice = await invoiceService.getInvoice(getWorkspaceId(req), invoiceId)

    res.status(200).json({ invoice })
  } catch (error) {
    next(error)
  }
}

export const createInvoice: RequestHandler = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(
      getWorkspaceId(req),
      getUserId(req),
      req.validatedBody as CreateInvoiceInput,
    )

    res.status(201).json({ invoice })
  } catch (error) {
    next(error)
  }
}

export const updateInvoice: RequestHandler = async (req, res, next) => {
  try {
    const { invoiceId } = req.validatedParams as { invoiceId: string }
    const invoice = await invoiceService.updateInvoice(
      getWorkspaceId(req),
      invoiceId,
      getUserId(req),
      req.validatedBody as UpdateInvoiceInput,
    )

    res.status(200).json({ invoice })
  } catch (error) {
    next(error)
  }
}

export const updateInvoiceStatus: RequestHandler = async (req, res, next) => {
  try {
    const { invoiceId } = req.validatedParams as { invoiceId: string }
    const invoice = await invoiceService.updateInvoiceStatus(
      getWorkspaceId(req),
      invoiceId,
      getUserId(req),
      req.validatedBody as UpdateInvoiceStatusInput,
    )

    res.status(200).json({ invoice })
  } catch (error) {
    next(error)
  }
}

export const deleteInvoice: RequestHandler = async (req, res, next) => {
  try {
    const { invoiceId } = req.validatedParams as { invoiceId: string }

    await invoiceService.deleteInvoice(getWorkspaceId(req), invoiceId, getUserId(req))

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
