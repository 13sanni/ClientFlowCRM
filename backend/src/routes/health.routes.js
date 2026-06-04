import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'clientflow-crm-api',
    timestamp: new Date().toISOString(),
  })
})

export default router
