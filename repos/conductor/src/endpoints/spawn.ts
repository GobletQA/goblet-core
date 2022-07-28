import { AppRouter } from '@GSH/Router'
import { Request, Response, express } from 'express'
const middleware = [express.json(), express.urlencoded({ extended: true })]

export const spawn = async (req:Request, res:Response) => {
  // TODO: call the spawn method from the conductor class
  const conductor = req.app.locals.conductor
  const { ports, image, container } =  await conductor.spawnContainer(req.body)

}

AppRouter.post('/spawn/container', ...middleware, spawn)