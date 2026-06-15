import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireWorkspaceAccess } from '../../middleware/rbac.middleware.js'
import * as notificationsController from './notifications.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireWorkspaceAccess(), notificationsController.getNotifications)
router.patch('/read-all', requireWorkspaceAccess(), notificationsController.markAllAsRead)
router.patch('/:id/read', requireWorkspaceAccess(), notificationsController.markAsRead)

export default router
