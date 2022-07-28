import { noOpObj } from '@keg-hub/jsutils'
import { AppRouter } from '@GCD/Server/router'
import express, { Request, Response } from 'express'

const middleware = [express.json(), express.urlencoded({ extended: true })]


const spawnGet = async (req:Request, res:Response) => {
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)

  const {
    image,
    ports,
    container
  } = await conductor.spawnContainer(imageRef, req.body)

  res.status(200).json({ ports, image, container })

}

export const spawn = async (req:Request, res:Response) => {
  // TODO: call the spawn method from the conductor class
  const { imageRef } =  req.params
  const conductor = req.app.locals.conductor
  if(!conductor) throw new Error(`Missing Conductor Instance`)
  
  const { ports, image, container } =  await conductor.spawnContainer({
    imageRef,
    ...req.body,
  })

  res.status(200).json({ ports, image, container })
}

AppRouter.post('/spawn/:imageRef', ...middleware, spawn)
// TODO: remove this, it should only be used temporarly
AppRouter.get('/spawn/:imageRef', ...middleware, spawnGet)