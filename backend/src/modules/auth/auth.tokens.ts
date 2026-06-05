import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import { HttpError } from '../../utils/http-error.js'

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL_DAYS = 30

export type AccessTokenPayload = {
  sub: string
  workspaceId?: string
}

function getJwtSecret(value: string | undefined, name: string) {
  if (!value) {
    throw new HttpError(500, `${name} is not configured`)
  }

  return value
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, getJwtSecret(env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'), {
    expiresIn: ACCESS_TOKEN_TTL,
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    getJwtSecret(env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
  ) as AccessTokenPayload
}

export function createRefreshToken() {
  const token = crypto.randomBytes(48).toString('hex')
  const tokenHash = hashRefreshToken(token)
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)

  return { token, tokenHash, expiresAt }
}

export function hashRefreshToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}
