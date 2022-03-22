import React from 'react'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Text, View } from '@keg-hub/keg-components'
import { Check } from 'HKAssets/icons/check'
import { Times } from 'HKAssets/icons/times'
import { Loading } from '@keg-hub/keg-components'

const textStyle = {
  ftSz: 12,
  fl: 1,
  jtC: 'center',
  alI: 'center',
  pos: 'relative',
  lineHeight: 17,
  inlineSize: '90%',
  overflowWrap: 'break-word',
}

export const TrackerMain = reStyle(View)(theme => ({
  ovfX: 'hidden',
  fl: 1,
  p: theme.padding.size,
}))

export const TrackerTests = reStyle(View)(theme => ({}))

export const ReTrackerText = reStyle(Text)(theme => ({
  ...textStyle,
  ftWt: 'bold',
  color: theme.tapColors.linkLight,
}))

export const ReMetaText = reStyle(Text)(theme => ({
  ...textStyle,
  color: theme.tapColors.disabledColor,
}))

export const ReRunText = reStyle(Text)(theme => ({
  ...textStyle,
  color: theme.tapColors.disabledColor,
}))

export const ReTagText = reStyle(Text)(theme => ({
  ...textStyle,
  color: theme.tapColors.warnDark,
}))

export const ReHeaderText = reStyle(Text)(theme => ({
  ...textStyle,
  ftWt: 'bold',
  ftSz: 12,
  color: theme.tapColors.primaryDark,
}))

export const ReErrorText = reStyle(Text)(theme => ({
  ...textStyle,
  ftWt: 'bold',
  color: theme.tapColors.dangerLight,
}))

export const ReSuccessText = reStyle(Text)(theme => ({
  ...textStyle,
  color: theme.tapColors.successLight,
}))

export const ReRunning = reStyle(Loading, 'styles')(theme => ({
  main: {
    pos: `relative`,
    mL: theme.margin.size * 1.5,
    c: theme.tapColors.primaryLight,
  },
  indicator: {
    icon: {
      // See /theme/domStyles/body.js for how the height and width get set
      color: theme.tapColors.primaryLight,
    }
  }
}))

export const ReErrorIcon = reStyle(Times)(theme => ({
  pos: 'absolute',
  marginLeft: theme.margin.size / 1.5,
}), theme => ({
  width: 14,
  height: 14,
  color: theme.tapColors.dangerLight,
}))

export const ReSuccessIcon = reStyle(Check)(theme => ({
  pos: 'absolute',
  marginLeft: theme.margin.size / 1.5,
}), theme => ({
  width: 14,
  height: 14,
  color: theme.tapColors.successLight,
}))

