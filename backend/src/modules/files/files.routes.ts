import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { env } from '../../config/env.js'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.use(requireAuth)

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file provided' })
    return
  }

  try {
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'clientflow_crm', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      stream.end(req.file!.buffer)
    })

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (err) {
    console.error('Cloudinary upload failed', err)
    res.status(500).json({ message: 'Upload failed' })
  }
})

export default router

