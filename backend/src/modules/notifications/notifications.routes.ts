import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import * as notificationsController from './notifications.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', notificationsController.getNotifications)
router.patch('/read-all', notificationsController.markAllAsRead)
router.patch('/:id/read', notificationsController.markAsRead)

export default router
