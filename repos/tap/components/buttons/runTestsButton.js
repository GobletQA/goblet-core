import React from 'react'
import { Rabbit } from 'HKAssets/icons/rabbit'
import { GobletButton } from './button.restyle'
import { useRunAction } from 'HKHooks/tests/useRunAction'

/**
 * RunTestsButton - Component for start a test run using sockr
 * @param {Object} props
 * @param {Object} props.activeFile - Current active fileModel
 * @param {Object} props.onRun - Callback called when the button is clicked
 * @param {boolean} props.checkPending - Check if the activeFile has pending changes
 * @param {boolean} props.runAllTests - Run all tests or just the ActiveFiles tests
 * @param {boolean} props.autoChangeScreen - Should the screen auto change when the tests are run
 *
 */
export const RunTestsButton = props => {
  const { children, text = 'Run Tests', styles, ...args } = props
  const onRun = useRunAction(args)

  return (
    <GobletButton
      {...args}
      Icon={Rabbit}
      onClick={onRun}
      type='secondary'
      classPrefix='run-tests'
    >
      {children || text}
    </GobletButton>
  )
}
