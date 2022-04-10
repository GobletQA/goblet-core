import React from 'react'
import { get, exists } from '@keg-hub/jsutils'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Autocomplete } from '@keg-hub/keg-components/autocomplete'
import {
  Text,
  View,
  Select,
  Option,
  Label,
  Switch,
  Checkbox,
  Touchable
} from '@keg-hub/keg-components'

export const ReMain = reStyle(View)((theme, { zIndex }) => ({
  pos: 'relative',
  p: theme.padding.size / 2,
  mT: theme.margin.size / 2,
  z: exists(zIndex) ? zIndex : 1,
  minH: get(theme, `form.input.default.height`, 35),
}))

export const ReAutoComplete = reStyle(Autocomplete, 'styles')(theme => {
  const itemActive = {
    content: { c: theme.tapColors.black },
    main: { bgC: theme.tapColors.appBackground },
  }

  return {
    main: {
      fl: 1,
    },
    menu: {
      main: {
        ...theme?.shared?.shadow,
        top: '-1px',
        bW: 1,
        bRad: 5,
        shO: 0.10,
        shR: 1,
        shOff: { width: 1, height: 1 },
        bTLR: 0,
        bTRR: 0,
        bC: theme.tapColors.border,
        bgC: theme.tapColors.white,
        w: `calc( 100% - 5px ) !important`,
      },
      item: {
        default: {
          main: {
            pL: theme.padding.size * 1.25
          },
          content: {
            whiteSpace: 'nowrap',
            c: theme.tapColors.textColorSecondary,
          },
        },
        hover: itemActive,
        active: itemActive,
      }
    }
  }
})

export const ReContainer = reStyle(View)(theme => ({
  fl: 1,
  flD: 'row',
}))

export const ReSelect = reStyle(Select, 'styles')(theme => ({
  main: {
    fl: 1,
    w: 35
  }
}))

export const ReCheckbox = reStyle(Checkbox, 'styles')(theme => ({
  main: {
    fl: 1,
    w: 'auto'
  }
}))

export const ReInlineTouch = reStyle(Touchable)(theme => ({
  fl: 1,
  d: `flex`,
}))

export const ReInlineText = reStyle(Text)(theme => ({
  h: 35,
  pL: 10,
  w: `100%`,
  d: `flex`,
  bW: 1,
  shR: 1,
  bRad: 5,
  ftSz: 14,
  shO: 0.10,
  bS: 'solid',
  cursor: `pointer`,
  alignItems: `center`,
  bC: 'transparent',
  bgC: 'transparent',
  // bC: theme.tapColors.border,
  // bgC: theme.tapColors.white,
}))


export const ReOption = reStyle(Option)(theme => ({}))

export const ReSwitch = reStyle(Switch)(theme => ({}))

export const ReLabel = reStyle(Label)(theme => ({
  fl: 1,
  flD: 'row',
  d: 'flex',
  jtC: 'space-between',
}))

export const ReLabelText = reStyle(Text)(theme => ({
  txAl: 'Left',
}))

const sideStyles = {
  fl: 1,
  maxW: 35,
  w: 35,
  h: 35,
  minW: 35,
  jtC: 'center',
  alI: 'center',
  bW: 1,
  bS: 'solid',
}

export const RePreside = reStyle(View)(theme => ({
  ...sideStyles,
  bRW: 0,
  bTLR: 5,
  bBLR: 5,
  bC: theme.tapColors.borderInput,
  bgC: theme.tapColors.appBackground,
}))

export const RePostside = reStyle(View)(theme => ({
  ...sideStyles,
  bLW: 0,
  bTRR: 5,
  bBRR: 5,
  bC: theme.tapColors.borderInput,
  bgC: theme.tapColors.appBackground,
}))

export const ReRequired = reStyle(Text)(theme => ({
  ftSz: 10,
  verticalAlign: 'top',
  mL: theme.margin.size / 3,
  c: theme.tapColors.danger,
}))

export const ReHelperText = reStyle(Text)(theme => ({
  ftSz: 11,
  mT: theme.margin.size / 3,
  c: theme.tapColors.infoDark,
}))

export const ReErrorText = reStyle(Text)(theme => ({
  ftSz: 11,
  txAl: 'right',
  ftWt: 'normal',
  mT: theme.margin.size / 4,
  c: theme.tapColors.dangerDark,
}))