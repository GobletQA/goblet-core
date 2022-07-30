import { Request, Response } from 'express'
import { AppRouter } from '@GCD/Server/routers'

const pullGet = async (req:Request, res:Response) => {
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status = await conductor.pull(imageRef)
  res.status(200).json({ status })

}

export const pull = async (req:Request, res:Response) => {
  // TODO: call the pull method from the conductor class
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status =  await conductor.pull(imageRef)
  res.status(200).json({ status })
}

AppRouter.post(`/pull/:imageRef`, pull)
// TODO: pull this, it should only be used temporarly
AppRouter.get(`/pull/:imageRef`, pullGet)