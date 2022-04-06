import React from 'react'
import { Record } from 'HKAssets/icons/record'
import { HerkinButton } from './button.restyle'
import { useRecordAction } from 'HKHooks/screencast/useRecordAction'

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
  const { children, text = 'Record', styles, ...args } = props
  const onRecord = useRecordAction(args)

  return (
    <HerkinButton
      {...args}
      type='danger'
      Icon={Record}
      onClick={onRecord}
      classPrefix='record-actions'
    >
      {children || text}
    </HerkinButton>
  )
}
