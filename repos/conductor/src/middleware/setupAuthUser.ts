import { Express, Request, Response, NextFunction } from 'express'
import { getApp } from '@gobletqa/shared/app'
import type { Conductor } from '../conductor'
import { hashString } from '@keg-hub/jsutils'

// TODO: This may need to go on both routers, need to validate
import { AppRouter } from '@gobletqa/conductor/server/routers'

export const setupAuthUser = (app:Express) => {
  app = app || getApp() as Express

  app.use((req:Request, res:Response, next:NextFunction) => {
    const conductor = req.app.locals.conductor as Conductor
    if(!conductor) throw new Error(`Missing Conductor Instance`)

    const hashKey = conductor?.config?.proxy?.hashKey
    // TODO: pull user from the auth-header
    // Ensure it throws an error if not found
    const user = req?.query?.user
    res.locals.user = user
    res.locals.subdomain = hashString(`${user}-${hashKey}`)

    next()
  })
}
