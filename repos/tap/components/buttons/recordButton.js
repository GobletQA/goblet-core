import React, { useMemo } from 'react'

import { tapColors } from 'HKTheme/tapColors'
import { Record } from 'HKAssets/icons/record'
import { GobletButton } from './button.restyle'
import { SlowFlash } from 'HKComponents/slowFlash'
import { useRecordAction } from 'HKHooks/screencast/useRecordAction'
import { Loading } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'


export const ReLoading = reStyle(Loading, 'styles')(theme => ({
  main: {
    pos: `relative`,
    mL: theme.margin.size * 1.5,
    c: theme.tapColors.danger,
  },
  indicator: {
    icon: {
      // See /theme/domStyles/body.js for how the height and width get set
      color: theme.tapColors.danger,
    }
  }
}))


const useRecordProps = (isRecording, loading) => {
  return useMemo(() => {
    const Icon = loading ? ReLoading : Record
    return isRecording
      ? {
          Icon,
          color: tapColors.buttonText,
          themePath: 'button.contained.danger',
          styles: {text: {color: tapColors.buttonText}}
        }
      : {
          Icon,
          color: tapColors.danger,
          themePath: 'button.outline.danger',
          styles: {text: {color: tapColors.danger}}
        }
  }, [isRecording, loading])
}


/**
 * RecordButton - Component for start a test run using sockr
 * @param {Object} props
 * @param {Object} props.activeFile - Current active fileModel
 * @param {Object} props.onRun - Callback called when the button is clicked
 * @param {boolean} props.checkPending - Check if the activeFile has pending changes
 * @param {boolean} props.runAllTests - Run all tests or just the ActiveFiles tests
 * @param {boolean} props.autoChangeScreen - Should the screen auto change when the tests are run
 *
 */
export const RecordButton = props => {
  const { children, text = 'Record', altText, onRecord } = props

  const {
    loading,
    onClick,
    isRecording,
  } = useRecordAction({ onRecord })
  const recordText = altText || `Stop`
  const recordProps =  useRecordProps(isRecording, loading)

  return (
    <SlowFlash
      duration={250}
      minOpacity={0.3}
      flashing={isRecording}
    >
      <GobletButton
        {...recordProps}
        onClick={onClick}
        Icon={recordProps.Icon}
        classPrefix='record-actions'
      >
        {children || (isRecording ? recordText : text)}
      </GobletButton>
    </SlowFlash>
  )
}
