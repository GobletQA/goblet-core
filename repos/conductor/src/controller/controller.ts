
import path from 'path'
import { capitalize, deepMerge } from '@keg-hub/jsutils'
import type { Conductor } from '../conductor'
import { checkImgConfig } from '../utils/checkImgConfig'
import {
  TImgRef,
  TImgConfig,
  TImgsConfig,
  TCreateOpts,
  TContainerObj,
  TContainerRef,
  TContainerRoute,
  TCreateResponse,
  TControllerConfig,
} from '../conductor.types'


const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Controller method must be overriden by an extending Class`)
}

export class Controller {

  images: TImgsConfig
  conductor: Conductor
  config: TControllerConfig
  containers:Record<string, TContainerObj> = {}

  constructor(conductor:Conductor, config:TControllerConfig){
    this.config = config
    this.conductor = conductor
  }

  getImg(imageRef:TImgRef): TImgConfig {
    return typeof imageRef === 'string' ? this.images[imageRef] : imageRef
  }

  buildImgUri(imageRef:TImgRef){
    const image = this.getImg(imageRef)
    !image && this.notFoundErr({ type: `image`, ref: imageRef as string })
    
    if(image.uri) return image.uri

    const {
      user=``,
      name=``,
      provider=``,
      tag=`latest`,
    } = image

    return `${path.join(...[provider, user, name].filter(Boolean))}:${tag}`
  }

  /**
   * Ensures the passed in config is valid
   */
  validateImg(imageRef:TImgRef) {
    const img = this.getImg(imageRef)
   checkImgConfig(img, imageRef)
  }

  buildImgs(images:TImgsConfig){
    this.images = Object.entries(images)
      .reduce((acc, [key, img]) => {
        checkImgConfig(img, key)
        acc[key] = deepMerge(img)
        acc[key].uri = acc[key].uri || this.buildImgUri(acc[key])

        return acc
      }, {})
  }

  getContainer(containerRef:TContainerRef):TContainerObj {
    if(typeof containerRef === 'string')
      return this.containers[containerRef]

    return Object.values(this.containers)
      .find(cont => (
        cont === containerRef
        || cont.id === containerRef.id
      ))
  }

  remove = async (containerRef:TContainerRef) => {
    const container = this.getContainer(containerRef)
    !container && this.notFoundErr({ type: `container`, ref: containerRef as string })

    await container.stop()
    await container.remove()

    this.containers = Object.entries(this.containers)
      .reduce((acc, [ref, cont]:[string, TContainerObj]) => {
        cont.id !== container.id && (acc[ref] = cont)

        return acc
      }, {})

  }

  async create(imageRef:TImgRef, createOpts?:TCreateOpts):Promise<TCreateResponse> {
    throwOverrideErr()
    return undefined
  }

  getContainerRoute = async (containerRef:TContainerRef):Promise<TContainerRoute> => {
    throwOverrideErr()
    return undefined
  }

  notFoundErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    this.controllerErr({
      ...args,
      message: message || [
      `Failed removing ${type}.`,
      `${capitalize(type)} ${ref ? ref+' ' : ''} could not be found.\n`
    ].join(' ')
    })
  }

  controllerErr = (args:Record<string, string>) => {
    const {
      ref=``,
      message,
      type='container',
    } = args
    throw new Error(`[Controller Error] - ${capitalize(type)}: ${message}`)
  }

}