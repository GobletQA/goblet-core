import { Request, Response, NextFunction } from 'express'
import { AppRouter } from '@gobletqa/conductor/server/routers'

/**
 * Root get endpoint to validate the server is running
 */
AppRouter.get(`/`, (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: `Conductor API is running`, })
})

/**
 * Handle favicon requests gracefully
 */
AppRouter.get(`/favicon.ico`, (req, res) => res.status(204).setHeader(`content-type`, `image/x-icon`).send())

/**
 * Handle health-check requests
 */
AppRouter.get(`/health-check`, (req, res) => res.status(204).send())
