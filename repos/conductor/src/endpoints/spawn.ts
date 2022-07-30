import { Request, Response } from 'express'
import { hashString } from '@keg-hub/jsutils'
import { AppRouter } from '@gobletqa/conductor/server/routers'


const spawnGet = async (req:Request, res:Response) => {
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const status = await conductor.spawn(
    imageRef,
    req.body,
    hashString(`${req?.query?.user}-${conductor?.config?.proxy?.hashKey}`)
  )

  res.status(200).json(status)
}

export const spawn = async (req:Request, res:Response) => {
  // TODO: call the spawn method from the conductor class
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)
  
  const status = await conductor.spawn(
    imageRef,
    req.body,
    // TODO: add middleware to pull the user form a header,
    // So it can be accessed here and passed to the spawn command
    `${req?.query?.user || ``}-${req.ip}-${req.headers.host}`
  )

  res.status(200).json(status)
}

AppRouter.post(`/spawn/:imageRef`, spawn)
// TODO: remove this, it should only be used temporarly
AppRouter.get(`/spawn/:imageRef`, spawnGet)