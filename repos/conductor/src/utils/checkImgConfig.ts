import { TImgConfig, TImgRef } from '../types'

export const checkImgConfig = (img:TImgConfig, imgRef?:TImgRef) => {
  const containerProps = [`ports`]
  const imgProps = [ `tag`, `name`, `provider`, `container` ]

  const imgName = typeof imgRef === 'string' ? imgRef : img.name

  imgProps.map((prop:string) => {
    if (!(prop in img))
      throw new Error(`Required property ${prop} not found in ${imgName} config`)
  })

  containerProps.map((prop:string) => {
    if (!(prop in img.container))
      throw new Error(`Required property ${prop} not found in ${imgName}.container config`)
  })

}