import React from 'react'
import { TimesFilled } from 'HKAssets/icons/timesFilled'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Modal, ItemHeader, View, Text, H5, Loading } from '@keg-hub/keg-components'

export const ReModal = reStyle(
  Modal,
  'styles'
)(theme => ({
  main: {},
  content: {
    minWidth: 550,
    padding: theme.padding.size,
    paddingTop: 0,
    borderTopLeftRadius: theme.tapColors.borderRadius * 3,
    borderTopRightRadius: theme.tapColors.borderRadius * 3,
    borderBottomLeftRadius: theme.tapColors.borderRadius,
    borderBottomRightRadius: theme.tapColors.borderRadius,
  },
}))

export const ReModalHeader = reStyle(
  ItemHeader,
  'styles'
)(theme => ({
  main: {
    maxHeight: 50,
    left: theme.padding.size * -1,
    backgroundColor: theme.tapColors.primaryDark,
    width: `calc( 100% + ${theme.padding.size * 2}px )`,
    borderTopLeftRadius: theme.tapColors.borderRadius,
    borderTopRightRadius: theme.tapColors.borderRadius,
  },
  content: {
    center: {
      content: {
        title: {
          color: theme.tapColors.textColorAlt,
        },
      },
    },
  },
}))

export const ReHeadLeft = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  jtC: 'center',
  alI: 'start',
  pH: theme.padding.size,
}))

export const ReHeadRight = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  jtC: 'center',
  alI: 'end',
  pH: theme.padding.size,
}))

export const ReHeadCenter = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  flD: 'row',
  jtC: 'center',
  alI: 'center',
  pH: theme.padding.size,
}))

export const ReHeadText = reStyle(H5)(theme => ({
  ftWt: 'bold',
  pL: theme.padding.size / 2,
  color: theme.tapColors.textColorAlt,
}))

export const ReForm = reStyle(View)(theme => ({
  fl: 1,
  mT: theme.margin.size / 2,
}))

/**
 * SignIn Modal only styles
 */
export const ReSignInMain = reStyle(View)({
  mT: 15,
})

/**
 * ConnectRepo Modal only styles
 */
 
 const messageStyles = {
  ftSz: 12,
  ftWt: 'bold',
  alI: 'center',
  jtC: 'center',
  display: 'flex',
  textAlign: 'center',
 }
 
export const ReConnectError = reStyle(Text)(theme => ({
  ...messageStyles,
  mB: theme.margin.size / 2,
  mT: theme.margin.size / 2,
  c: theme.tapColors.dangerDark,
}))

export const ReErrorIcon = reStyle(TimesFilled)(
  theme => ({ marginRight: theme.margin.size / 1.5, }),
  theme => ({
    width: 20,
    height: 20,
    color: theme.tapColors.dangerDark,
  })
)

export const ReConnecting = reStyle(Text)(theme => ({
  ...messageStyles,
  mB: theme.margin.size / 2,
  mT: theme.margin.size / 2,
  c: theme.tapColors.primaryLight,
}))

export const ReLoading = reStyle(Loading, 'styles')(theme => ({
  main: {
    mR: theme.margin.size * 1.5,
    c: theme.tapColors.primaryLight,
  },
  indicator: {
    icon: {
      color: theme.tapColors.primaryLight,
    }
  }
}))

export const ReFooterMain = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  flD: 'row',
  borderTopWidth: 1,
  mT: theme.margin.size,
  pT: theme.padding.size,
  borderTopColor: theme.tapColors.border,
}))

export const ReFooterLeft = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  jtC: 'center',
  alI: 'start',
}))

export const ReFooterCenter = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  jtC: 'center',
  alI: 'center',
}))

export const ReFooterRight = reStyle(View)(theme => ({
  fl: 1,
  d: 'flex',
  jtC: 'center',
  alI: 'end',
}))