import { Request, Response } from 'express'
import { AppRouter } from '@gobletqa/conductor/server/routers'


export const pull = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status =  await conductor.pull(req.params.imageRef)

  res.status(200).json(status)
}

AppRouter.post(`/pull/:imageRef`, pull)
// TODO: pull this, it should only be used temporarly
AppRouter.get(`/pull/:imageRef`, pull)