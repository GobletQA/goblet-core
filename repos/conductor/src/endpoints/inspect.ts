import { Request, Response } from 'express'
import type { Conductor } from '@gobletqa/conductor/conductor'
import { AppRouter } from '@gobletqa/conductor/server/routers'


export const inspect = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor as Conductor
  const refCont = conductor.controller.getContainer((req.params.containerRef || ``).trim())
  const container = refCont || conductor.controller.getContainer((res.locals.subdomain).trim())
  const routes = conductor.routes[res.locals.subdomain]

  res.status(200).json({ container, routes })
}

AppRouter.post(`/inspect/:containerRef`, inspect)
// TODO: inspect this, it should only be used temporarly
AppRouter.get(`/inspect/:containerRef`, inspect)
