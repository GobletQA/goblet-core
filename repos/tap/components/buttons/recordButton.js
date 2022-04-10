import React from 'react'
import { Values } from 'HKConstants'
import { Record } from 'HKAssets/icons/record'
import { HerkinButton } from './button.restyle'
import { useSelector } from 'HKHooks/useSelector'
import { SlowFlash } from 'HKComponents/slowFlash'
import { useRecordAction } from 'HKHooks/screencast/useRecordAction'
import { tapColors } from 'HKTheme/tapColors'

const { CATEGORIES } = Values


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
  const { children, text = 'Record', altText, styles, ...args } = props
  const { recordingBrowser } = useSelector(CATEGORIES.RECORDING_BROWSER)
  const { isRecording } = recordingBrowser

  const onRecord = useRecordAction(args)
  const recordText = altText || `Recording`

  return (
    <SlowFlash
      minOpacity={0.5}
      flashing={isRecording}
    >
      <HerkinButton
        {...args}
        themePath='button.outline.danger'
        Icon={Record}
        color={tapColors.danger}
        onClick={onRecord}
        classPrefix='record-actions'
        styles={{text: {color: tapColors.danger}}}
      >
        {children || (isRecording ? recordText : text)}
      </HerkinButton>
    </SlowFlash>
  )
}
