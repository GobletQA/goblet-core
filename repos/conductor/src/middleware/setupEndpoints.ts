import { Express } from 'express'
import { getApp } from '@gobletqa/shared/app'
import { AppRouter } from '@GCD/Server/router'
import '@GCD/Endpoints'

export const setupEndpoints = (app?:Express) => {
  app = app || getApp() as Express
  app.use(AppRouter)
}