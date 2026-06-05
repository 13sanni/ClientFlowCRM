import type { RequestHandler } from 'express'
import type { ZodSchema } from 'zod'
import { HttpError } from '../utils/http-error.js'

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown
      validatedQuery?: unknown
      validatedParams?: unknown
    }
  }
}

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      next(new HttpError(400, result.error.issues[0]?.message || 'Invalid request body'))
      return
    }

    req.body = result.data
    req.validatedBody = result.data
    next()
  }
}

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      next(new HttpError(400, result.error.issues[0]?.message || 'Invalid query parameters'))
      return
    }

    req.validatedQuery = result.data
    next()
  }
}

export function validateParams(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      next(new HttpError(400, result.error.issues[0]?.message || 'Invalid route parameters'))
      return
    }

    req.validatedParams = result.data
    next()
  }
}
