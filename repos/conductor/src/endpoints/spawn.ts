import { Request, Response } from 'express'
import { AppRouter } from '@gobletqa/conductor/server/routers'

export const spawn = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor

  const status = await conductor.spawn(
    req.params.imageRef,
    req.body,
    res.locals.subdomain
  )

  res.status(200).json(status)
}

AppRouter.post(`/spawn/:imageRef`, spawn)
// TODO: remove this, it should only be used temporarly
AppRouter.get(`/spawn/:imageRef`, spawn)