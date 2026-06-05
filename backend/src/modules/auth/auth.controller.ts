import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import * as authService from './auth.service.js'

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

function setRefreshCookie(res: Parameters<RequestHandler>[1], refreshToken: string) {
  res.cookie('refreshToken', refreshToken, refreshCookieOptions)
}

function getRefreshToken(req: Parameters<RequestHandler>[0]) {
  return req.cookies?.refreshToken || req.body?.refreshToken
}

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signUp(req.body)

    setRefreshCookie(res, result.refreshToken)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signIn(req.body)

    setRefreshCookie(res, result.refreshToken)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.refreshSession(getRefreshToken(req))

    setRefreshCookie(res, result.refreshToken)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  try {
    await authService.logout(getRefreshToken(req))

    res.clearCookie('refreshToken', refreshCookieOptions)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      throw new HttpError(401, 'Authentication required')
    }

    const user = await authService.getCurrentUser(req.auth.userId)

    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}
