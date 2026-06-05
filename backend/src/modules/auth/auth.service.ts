import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../utils/http-error.js'
import type { SignInInput, SignUpInput } from './auth.schemas.js'
import { createRefreshToken, hashRefreshToken, signAccessToken } from './auth.tokens.js'

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function createUniqueWorkspaceSlug(workspaceName: string) {
  const baseSlug = createSlug(workspaceName) || 'workspace'
  let slug = baseSlug
  let attempt = 1

  while (await prisma.workspace.findUnique({ where: { slug } })) {
    attempt += 1
    slug = `${baseSlug}-${attempt}`
  }

  return slug
}

function sanitizeUser(user: { id: string; name: string; email: string; avatarUrl: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
}

async function createSession(userId: string, workspaceId?: string) {
  const refreshToken = createRefreshToken()

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshToken.tokenHash,
      expiresAt: refreshToken.expiresAt,
      userId,
    },
  })

  return {
    accessToken: signAccessToken({ sub: userId, workspaceId }),
    refreshToken: refreshToken.token,
  }
}

export async function signUp(input: SignUpInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } })

  if (existingUser) {
    throw new HttpError(409, 'Email is already registered')
  }

  const passwordHash = await bcrypt.hash(input.password, 10)
  const workspaceName = input.workspaceName || `${input.name}'s Workspace`
  const workspaceSlug = await createUniqueWorkspaceSlug(workspaceName)

  const { user, workspace } = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    })

    const createdWorkspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug: workspaceSlug,
        members: {
          create: {
            userId: createdUser.id,
            role: 'OWNER',
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    return { user: createdUser, workspace: createdWorkspace }
  })

  const session = await createSession(user.id, workspace.id)

  return {
    user: sanitizeUser(user),
    workspace,
    ...session,
  }
}

export async function signIn(input: SignInInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      passwordHash: true,
      memberships: {
        orderBy: { createdAt: 'asc' },
        take: 1,
        select: {
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const workspace = user.memberships[0]?.workspace
  const session = await createSession(user.id, workspace?.id)

  return {
    user: sanitizeUser(user),
    workspace,
    ...session,
  }
}

export async function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new HttpError(401, 'Refresh token is required')
  }

  const tokenHash = hashRefreshToken(refreshToken)
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          memberships: {
            orderBy: { createdAt: 'asc' },
            take: 1,
            select: { workspaceId: true },
          },
        },
      },
    },
  })

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    throw new HttpError(401, 'Invalid refresh token')
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  })

  return createSession(storedToken.userId, storedToken.user.memberships[0]?.workspaceId)
}

export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) {
    return
  }

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashRefreshToken(refreshToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      memberships: {
        select: {
          role: true,
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw new HttpError(404, 'User not found')
  }

  return user
}
