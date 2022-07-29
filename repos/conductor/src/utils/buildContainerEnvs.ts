import { TImgConfig } from '../types'
import { exists } from '@keg-hub/jsutils'

export const buildContainerEnvs = (image:TImgConfig) => {
  return image?.container?.envs &&
    Object.entries(image?.container?.envs)
      .reduce((acc, [name, value]) => {
        exists(value) && acc.push(`${name}=${value}`)

        return acc
      }, []) || []
}