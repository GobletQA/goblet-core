import { TImgConfig } from '../conductor.types'

export const checkImgConfig = (key:string, img:TImgConfig) => {
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