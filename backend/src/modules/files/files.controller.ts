import type { RequestHandler } from 'express'
import { HttpError } from '../../utils/http-error.js'
import * as filesService from './files.service.js'

export const uploadFile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId
    const workspaceId = req.auth?.workspaceId

    if (!userId || !workspaceId) {
      throw new HttpError(401, 'Unauthorized')
    }

    if (!req.file) {
      throw new HttpError(400, 'No file uploaded')
    }

    const { clientId, dealId, invoiceId } = req.body

    const fileUrl = req.file.path // Cloudinary URL

    const attachment = await filesService.createFileAttachment({
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storageKey: req.file.filename,
      url: fileUrl,
      workspaceId,
      uploadedById: userId,
      clientId,
      dealId,
      invoiceId,
    })

    res.status(201).json(attachment)
  } catch (error) {
    next(error)
  }
}
