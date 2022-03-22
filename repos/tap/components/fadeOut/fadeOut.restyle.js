import { reStyle } from '@keg-hub/re-theme/reStyle'
import { H5, View, Section } from '@keg-hub/keg-components'

export const Fade = reStyle(View)((theme, props) => ({
  lt: 0,
  rt: 0,
  tp: 50,
  bt: -50,
  h: '100vh',
  pos: 'absolute',
  bgC: props?.color || theme?.tapColors?.white,
  transitionDuration: `${(props.speed || 500) * 0.001}s`,
  transitionProperty: 'opacity',
}))

export const FadeView = reStyle(View)({
  fl: 1,
  tp: -100,
  jC: 'center',
  aI: 'center',
  flD: 'column',
  pos: 'relative',
})

export const FadeText = reStyle(H5)({
  mT: 30,
  txAl: 'center',
})

export const FadeSection = reStyle(Section)({
  fl: 1,
  jtC: 'center',
  alI: 'center',
  height: '100%',
  display: 'flex',
})
