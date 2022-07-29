import { Request, Response, NextFunction } from 'express'
import { AppRouter } from '@GCD/Server/router'

/**
 * Root get endpoint to validate the server is running
 */
AppRouter.get(`/`, (req: Request, res: Response, next: NextFunction) => {
  // TODO: Add middleware to bypass these specific routes when sub-domains exist
  console.log(`TODO: Add middleware to bypass these specific routes when sub-domains exist`)
  
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
