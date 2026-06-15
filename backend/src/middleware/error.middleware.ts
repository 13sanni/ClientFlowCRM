import type { ErrorRequestHandler, RequestHandler } from 'express'

type ApiError = Error & {
  statusCode?: number
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler: ErrorRequestHandler = (error: ApiError, req, res, next) => {
  const statusCode = error.statusCode || 500

  if (statusCode >= 500) {
    console.error('Server Error:', error)
  }

  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'Internal server error'

  res.status(statusCode).json({ message })
}
