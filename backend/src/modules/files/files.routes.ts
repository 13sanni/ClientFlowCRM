import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { requireAuth } from '../../middleware/auth.middleware.js'
import * as filesController from './files.controller.js'
import { env } from '../../config/env.js'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'clientflow_crm',
      resource_type: 'auto',
    }
  },
})

const upload = multer({ storage })

const router = Router()

router.use(requireAuth)

router.post('/upload', upload.single('file'), filesController.uploadFile)

export default router
