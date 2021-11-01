import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Text, View, Column } from '@keg-hub/keg-components'


export const CanvasMain = reStyle(View)((theme, props) => {
  return  {
    fl: 1,
    minW: 0,
    minH: 0,
    ftSz: 18,
    lnH: 24,
    jtC: 'center',
    alI: 'center',
    ovf: 'hidden',
    display: 'initial',
    textSizeAdjust: '100%',
    boxSizing: `border-box`,
    bgC: theme.tapColors.white,
    fontSmoothing: 'antialiased',
  }
})


export const SCMain = reStyle(View)({
  fl: 1,
  flD: 'row',
})

export const SCContainer = reStyle(Column)({
  fl: 1,
})

export const TrackerMain = reStyle(View)(theme => ({
  ovfX: 'hidden',
  p: theme.padding.size, 
}))

export const TrackerTests = reStyle(View)(theme => ({
}))

export const TrackerText = reStyle(Text)(theme => ({
  ftSz: 12,
  inlineSize: '90%',
  overflowWrap: 'break-word',
}))

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