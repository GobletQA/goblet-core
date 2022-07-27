import path  from 'path'
import Dockerode from 'dockerode'
import getPort from 'get-port'
import { DEF_HOST_IP } from './constants'
import type { Conductor } from './conductor'
import { TDockerConfig, TImgsConfig, TImgConfig } from './conductor.types'

const checkImgConfig = (key:string, img:TImgConfig) => {
  const containerProps = [`ports`]
  const imgProps = [ `tag`, `name`, `provider`, `container` ]

  imgProps.map((prop:string) => {
    if (!(prop in img))
      throw new Error(`Required property ${prop} not found in ${key} config`)
  })

  containerProps.map((prop:string) => {
    if (!(prop in img.container))
      throw new Error(`Required property ${prop} not found in ${key}.container config`)
  })

}

const buildContainerPorts = async (image) => {

  return image.container.ports.reduce(async (toResolve, port) => {
    const acc = await toResolve
    const avaliablePort = await getPort({ host: DEF_HOST_IP })

    acc[port] = [{ HostIP: DEF_HOST_IP, HostPort: avaliablePort.toString() }]

    return acc
  }, Promise.resolve({}))
  
}


export class Docker {

  docker: Dockerode
  conductor: Conductor
  config: TDockerConfig
  images: TImgsConfig

  constructor(conductor:Conductor, config:TDockerConfig){
    this.config = config
    this.docker = new Dockerode(config)
  }

  getImg(key:string, image?:TImgConfig){
    return image = image || this.images[key]
  }

  buildImgUri(key:string, image?:TImgConfig){
    const { name=``, tag=`latest`, provider=`` } = this.getImg(key, image)

    return `${path.join(provider, name)}:${tag}`
  }

  /**
   * Ensures the passed in config is valid
   */
  validateImg(key:string, image?:TImgConfig) {
    const img = this.getImg(key, image)
   checkImgConfig(key, img)
  }

  buildImgs(images:TImgsConfig){
    this.images = Object.entries(images)
      .reduce((acc, [key, img]) => {
        checkImgConfig(key, img)
        acc[key] = img

        return acc
      }, {})
  }


  async create(key:string, image?:TImgConfig):Promise<Record<string, any>> {
    const img = this.getImg(key, image)
    const PortBindings = await buildContainerPorts(img)

    const container = await this.docker.createContainer({
      PortBindings,
      Image: this.buildImgUri(key, img),
      PidsLimit: img.pidsLimit || this.config.pidsLimit || 20,
    })

    return { image: img, container, ports: PortBindings }

  }

}