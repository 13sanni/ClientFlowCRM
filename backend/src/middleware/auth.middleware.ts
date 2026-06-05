import type { RequestHandler } from 'express'
import type { WorkspaceRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { verifyAccessToken } from '../modules/auth/auth.tokens.js'
import { HttpError } from '../utils/http-error.js'

export type AuthContext = {
  userId: string
  workspaceId?: string
  workspaceRole?: WorkspaceRole
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext
    }
  }
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

    if (!token) {
      throw new HttpError(401, 'Authentication required')
    }

    const payload = verifyAccessToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    })

    if (!user) {
      throw new HttpError(401, 'Invalid authentication token')
    }

    const membership = payload.workspaceId
      ? await prisma.workspaceMember.findUnique({
          where: {
            userId_workspaceId: {
              userId: user.id,
              workspaceId: payload.workspaceId,
            },
          },
          select: { role: true },
        })
      : null

    if (payload.workspaceId && !membership) {
      throw new HttpError(403, 'Workspace access denied')
    }

    req.auth = {
      userId: user.id,
      workspaceId: payload.workspaceId,
      workspaceRole: membership?.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}
