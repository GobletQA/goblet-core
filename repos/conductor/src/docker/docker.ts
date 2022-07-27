import path  from 'path'
import Dockerode from 'dockerode'
import type { Conductor } from '../conductor'
import { checkImgConfig } from '../utils/checkImgConfig'
import { buildContainerPorts } from '../utils/buildContainerPorts'
import { TDockerConfig, TImgsConfig, TImgConfig } from '../conductor.types'

export class Docker {

  docker: Dockerode
  images: TImgsConfig
  conductor: Conductor
  config: TDockerConfig

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