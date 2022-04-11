import React from 'react'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { Text, View } from '@keg-hub/keg-components'


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

export const RecorderMain = reStyle(View)(theme => ({
  ovfX: 'hidden',
  fl: 1,
  p: theme.padding.size,
}))

export const RecorderLines = reStyle(View)(theme => ({}))


export const ReLineText = reStyle(Text)(theme => ({
  ...textStyle,
  color: theme.tapColors.textColor,
}))

