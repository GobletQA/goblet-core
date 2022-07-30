import { AppRouter } from '@gobletqa/conductor/server/routers'
import type { Conductor } from '@gobletqa/conductor/conductor'
import { TContainerInspect } from '../types'
import { Request, Response } from 'express'

const findContainer = (conductor:Conductor, containerRef:string) => {
  const containers = conductor.controller.containers

  return (Object.entries(containers)
    .find(([ref, container]:[string, TContainerInspect]) => {
      return ref.startsWith(containerRef)
        || container.Id.startsWith(containerRef.trim())
        || container?.Name === containerRef
    }) || [])[1]
}

export const inspect = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor as Conductor
  const container = findContainer(conductor, req.params.containerRef)
  const routes = conductor.routes[res.locals.subdomain]

  res.status(200).json({ container, routes })
}

AppRouter.post(`/inspect/:containerRef`, inspect)
// TODO: inspect this, it should only be used temporarly
AppRouter.get(`/inspect/:containerRef`, inspect)
