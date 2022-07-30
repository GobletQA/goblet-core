import { AppRouter } from '@gobletqa/conductor/server/routers'
import { Request, Response } from 'express'


export const remove = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.remove(req.params.containerRef)

  res.status(200).json({ status })
}

AppRouter.post(`/remove/:containerRef`, remove)
// TODO: remove this, it should only be used temporarly
AppRouter.get(`/remove/:containerRef`, remove)
