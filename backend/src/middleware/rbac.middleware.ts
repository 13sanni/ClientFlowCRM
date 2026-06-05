import type { RequestHandler } from 'express'
import type { WorkspaceRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { HttpError } from '../utils/http-error.js'

const roleRank: Record<WorkspaceRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  MANAGER: 3,
  SALES_REP: 2,
  VIEWER: 1,
}

function getWorkspaceId(req: Parameters<RequestHandler>[0]) {
  const value = req.params.workspaceId || req.body?.workspaceId || req.query.workspaceId

  if (Array.isArray(value)) {
    return value[0]
  }

  return value || req.auth?.workspaceId
}

function canAccessRole(userRole: WorkspaceRole, allowedRoles: WorkspaceRole[]) {
  return allowedRoles.some((allowedRole) => roleRank[userRole] >= roleRank[allowedRole])
}

export function requireWorkspaceAccess(): RequestHandler {
  return async (req, res, next) => {
    try {
      if (!req.auth?.userId) {
        throw new HttpError(401, 'Authentication required')
      }

      const workspaceId = getWorkspaceId(req)

      if (!workspaceId) {
        throw new HttpError(400, 'Workspace id is required')
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.auth.userId,
            workspaceId,
          },
        },
        select: {
          role: true,
        },
      })

      if (!membership) {
        throw new HttpError(403, 'Workspace access denied')
      }

      req.auth.workspaceId = workspaceId
      req.auth.workspaceRole = membership.role

      next()
    } catch (error) {
      next(error)
    }
  }
}

export function requireWorkspaceRole(...allowedRoles: WorkspaceRole[]): RequestHandler {
  return async (req, res, next) => {
    try {
      const accessMiddleware = requireWorkspaceAccess()

      await new Promise<void>((resolve, reject) => {
        accessMiddleware(req, res, (error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })

      if (!req.auth?.workspaceRole || !canAccessRole(req.auth.workspaceRole, allowedRoles)) {
        throw new HttpError(403, 'Insufficient workspace permissions')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export function requireWorkspaceOwnerOrAdmin() {
  return requireWorkspaceRole('ADMIN')
}

export function requireWorkspaceManager() {
  return requireWorkspaceRole('MANAGER')
}

export function requireWorkspaceSalesRep() {
  return requireWorkspaceRole('SALES_REP')
}
