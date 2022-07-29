import { exists } from '@keg-hub/jsutils'
import { TImgConfig , TContainerLabels} from '../types'
import { CONDUCTOR_LABEL, CONTAINER_LABELS } from '../constants'


export const buildContainerLabels = (image:TImgConfig):TContainerLabels => {
  return Object.entries(image?.container)
    .reduce((acc, [name, value]) => {
      CONTAINER_LABELS.includes(name)
        && exists(value)
        && (acc[`${CONDUCTOR_LABEL}.${name}`] = `${value}`)

      return acc  as Record<string,string>
    }, { [`${CONDUCTOR_LABEL}.conductor`]: image.name } as TContainerLabels)
}