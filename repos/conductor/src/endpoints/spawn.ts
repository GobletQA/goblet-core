import { Request, Response } from 'express'
import { AppRouter } from '@GCD/Server/router'


const spawnGet = async (req:Request, res:Response) => {
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status = await conductor.spawn(imageRef, req.body)

  res.status(200).json(status)

}

export const spawn = async (req:Request, res:Response) => {
  // TODO: call the spawn method from the conductor class
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)
  
  const status = await conductor.spawn(imageRef, req.body)

  res.status(200).json(status)
}

AppRouter.post('/spawn/:imageRef', spawn)
// TODO: remove this, it should only be used temporarly
AppRouter.get('/spawn/:imageRef', spawnGet)