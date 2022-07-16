import React from 'react'
import { Surface } from 'HKComponents/surface'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Text, View, Column } from '@keg-hub/keg-components'

export const LSurface = React.memo(reStyle(Surface, 'styles')((theme, props) => ({
  main: {
    fl: 2,
    maxW: props.leftWidth || `60vw`,
  }
})))

export const RSurface = React.memo(reStyle(Surface, 'styles')({
  main: {
    fl: 1,
    minW: `40vw`,
  }
}))

export const CanvasMain = reStyle(View)((theme, props) => ({
  fl: 1,
  minW: 0,
  minH: 0,
  ftSz: 18,
  lnH: 24,
  jtC: 'center',
  alI: 'center',
  ovf: 'hidden',
  display: 'initial',
  width: props.width,
  height: props.height,
  textSizeAdjust: '100%',
  boxSizing: `border-box`,
  bgC: theme.tapColors.white,
  fontSmoothing: 'antialiased',
}))

export const CanvasCover = reStyle(View)({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  position: 'absolute',
})

export const SCMain = reStyle(View)({
  fl: 1,
  flD: 'row',
})

export const SCContainer = reStyle(Column)({
  fl: 1,
})

export const ActionsContainer = reStyle(View)(theme => ({
  flD: 'row',
  pV: theme.padding.size / 2,
  jtC: 'center',
  alI: 'center',
}))

export const ActionMain = reStyle(View)({
  pL: 5,
  pR: 5,
})

export const LoadingMain = reStyle(View)({
  flex: 1,
  width: `100%`,
  height: '100%',
  display: `flex`,
  position: `absolute`,
  justifyContent: 'center',
})

export const LoadingText = reStyle(Text)({
  marginTop: 30,
  textAlign: 'center',
})