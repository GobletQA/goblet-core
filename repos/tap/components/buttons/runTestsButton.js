import React from 'react'
import { Rabbit } from 'SVAssets/icons'
import { HerkinButton } from './button.restyle'
import { useRunAction } from 'SVHooks/tests/useRunAction'

/**
 * Classes for the Run-Tests Button
 * @type {Object}
 */
const classes = {
  main: `run-tests-button.main`,
  button: `run-tests-button`,
  icon: `run-tests-button-icon`,
  text: `run-tests-button-text`
}

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
  const { children, text='Run Tests', styles, ...args } = props
  const onRun = useRunAction(args)

  return (
    <HerkinButton
      {...args}
      Icon={Rabbit}
      onClick={onRun}
      type='secondary'
      classes={classes}
    >
      {children || text}
    </HerkinButton>
  )

}