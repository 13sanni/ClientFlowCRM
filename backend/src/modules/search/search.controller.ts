import { Request, Response, NextFunction } from 'express'
import { globalSearch } from './search.service.js'

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = req.auth?.workspaceId
    const query = req.query.q as string

    if (!workspaceId) {
      res.status(400).json({ message: 'Workspace ID required' })
      return
    }

    if (!query) {
      res.json({ clients: [], deals: [], tasks: [], invoices: [] })
      return
    }

    const results = await globalSearch(workspaceId, query)
    res.json(results)
  } catch (error) {
    next(error)
  }
}
