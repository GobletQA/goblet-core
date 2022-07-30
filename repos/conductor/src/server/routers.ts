import express from 'express'
import { isFunc } from '@keg-hub/jsutils'
import asyncHandler from 'express-async-handler'

const Router = express.Router()
const boundGet = Router.get.bind(Router)
const boundPut = Router.put.bind(Router)
const boundPost = Router.post.bind(Router)
const boundPatch = Router.patch.bind(Router)
const boundDelete = Router.delete.bind(Router)
const defaultMiddleWare = [express.json(), express.urlencoded({ extended: true })]

/**
 * Loops the passed in handlers and wraps them in the asyncHandler method
 * Expects the first argument is a string representing the route path
 */
const wrapInAsync = (boundMethod, ...args) => {
  return boundMethod(
    args.shift(),
    ...defaultMiddleWare,
    ...args.filter(isFunc).map((handler) => asyncHandler(handler))
  )
}


/**
 * Root Express router for the backend API attached to the Main Express App
 * Extends the express Router, and overrides the main HTTP verb methods
 * It wraps the methods with asyncHandler so it's added by default to those methods
 */
export const AppRouter = Object.assign(Router, {
  get: (...args: Array<any>) => wrapInAsync(boundGet, ...args),
  put: (...args: Array<any>) => wrapInAsync(boundPut, ...args),
  post: (...args: Array<any>) => wrapInAsync(boundPost, ...args),
  patch: (...args: Array<any>) => wrapInAsync(boundPatch, ...args),
  delete: (...args: Array<any>) => wrapInAsync(boundDelete, ...args),
})

/**
 * Routes to handle proxy requests
 */
export const ProxyRouter = express.Router()