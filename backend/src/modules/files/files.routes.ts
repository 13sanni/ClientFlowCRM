import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../../middleware/auth.middleware.js'
import * as filesController from './files.controller.js'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex')
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

const router = Router()

router.use(requireAuth)

router.post('/upload', upload.single('file'), filesController.uploadFile)

export default router
