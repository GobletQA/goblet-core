import { View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { EllipsisV } from 'HKAssets/icons/ellipsisV'


export const ReHandle = reStyle(View)(theme => ({
  z: 1,
  w: 2,
  d: `flex`,
  alI: `center`,
  jtC: `center`,
  alS: `stretch`,
  pos: 'relative',
  cursor: `col-resize`,
  trD: '0.8s',
  trP: 'background-color',
  bgC: theme?.tapColors?.border,
}))

export const ReContent = reStyle(View)(theme => ({
  d: 'flex',
  bRad: 3,
  left: -4,
  width: 8,
  height: 25,
  alI: `center`,
  jtC: `center`,
  pos: 'absolute',
  trD: '0.8s',
  trP: 'background-color',
  bgC: theme?.colors?.palette?.black01,
}))

export const ReContainer = reStyle(View)({
  pos: 'absolute',
  top: `calc( 50vh - 16px )`
})

export const ReIcon = reStyle(EllipsisV)({
  trD: '0.8s',
  trP: 'color, fill, stroke',
})

export const ReResize = reStyle(View)({
  d: 'flex',
  pos: `relative`,
  // alI: 'center',
  // jtC: 'center',
})


const handleStyle = {
  width: 20,
  height: 20,
  bRad: `50%`,
  bgC: `#111`,
  pos: `absolute`,
  border: `3px solid #4286f4`,
}

export const ReTLHandle = reStyle(View)({
  ...handleStyle,
  left: 0,
  top: 0,
  cursor: `nwse-resize`
})

export const ReTRHandle = reStyle(View)({
  ...handleStyle,
  right: 0,
  top: 0,
  cursor: `nesw-resize`,
})

export const ReBLHandle = reStyle(View)({
  ...handleStyle,
  left: 0,
  bottom: 0,
  cursor: `nesw-resize`
})

export const ReBRHandle = reStyle(View)({
  ...handleStyle,
  right: 0,
  bottom: 0,
  cursor: `nwse-resize`,
})

export const ReTHandle = reStyle(View)({
  ...handleStyle,
  bottom: 0,
  left: `50%`,
  cursor: `nwse-resize`,
})

export const ReLHandle = reStyle(View)({
  ...handleStyle,
  left: 0,
  top: `50%`,
  cursor: `nwse-resize`,
})

export const ReRHandle = reStyle(View)({
  ...handleStyle,
  right: 0,
  top: `50%`,
  cursor: `nwse-resize`,
})

export const ReBHandle = reStyle(View)({
  ...handleStyle,
  bottom: 0,
  left: `50%`,
  cursor: `nwse-resize`,
})