import { AppRouter } from '@gobletqa/conductor/server/routers'
import { Request, Response } from 'express'

const removeGet = async (req:Request, res:Response) => {
  const { containerRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status = await conductor.cleanup(containerRef)
  res.status(200).json({ status })

}

export const remove = async (req:Request, res:Response) => {
  // TODO: call the remove method from the conductor class
  const { containerRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status =  await conductor.cleanup(containerRef)
  res.status(200).json({ status })
}

AppRouter.post(`/remove/:containerRef`, remove)
// TODO: remove this, it should only be used temporarly
AppRouter.get(`/remove/:containerRef`, removeGet)