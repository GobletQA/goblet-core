import { Request, Response } from 'express'
import { AppRouter } from '@GCD/Server/router'

/**
 * Root get endpoint to validate the server is running
 */
AppRouter.get(`/`, (req: Request, res: Response) => {
  return res.status(200).json({ message: `Conductor API is running`, })
})

/**
 * Handle favicon requests gracefully
 */
AppRouter.get(`/favicon.ico`, (req, res) => res.status(204).send())

/**
 * Handle health-check requests
 */
AppRouter.get(`/health-check`, (req, res) => res.status(204).send())
