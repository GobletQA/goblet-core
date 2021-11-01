import React, { useCallback } from 'react'
import { Save } from 'SVAssets/icons'
import { HerkinButton } from './button.restyle'
import { noOpObj, noOp } from '@keg-hub/jsutils'
import { saveFile } from 'SVActions/files/api/saveFile'
import { useActiveFile } from 'SVHooks/activeFile/useActiveFile'

/**
 * Hook to save the activeFile by calling the saveFile action
 * @param {Object} props
 *
 * @returns {function} - Callback to call when running tests on the active file
 */
const useSaveAction = props => {
  const {
    activeFile:propsActiveFile,
    onSave=noOp,
  } = props

  const { activeFile } = useActiveFile()
  const testFile = propsActiveFile || activeFile || noOpObj

  return useCallback(async event => {
    // Call the passed in onSave callback
    // If it returns false, then don't do anything else in this callback
    const shouldContinue = await onSave(event, testFile)

    shouldContinue && saveFile(testFile)
  }, [onSave, testFile])
}

/**
 * Classes for the Save-File Button
 * @type {Object}
 */
const classes = {
  main: `save-file-button.main`,
  button: `save-file-button`,
  icon: `save-file-button-icon`,
  text: `save-file-button-text`
}

/**
 * SaveFileButton - Component saving a file
 * @param {Object} props
 * @param {Object} props.activeFile - Current active fileModel
 * @param {Object} props.onSave - Callback called when the button is clicked
 *
 */
export const SaveFileButton = props => {
  const { children, text="Save File", ...args } = props

  const onSave = useSaveAction(args)

  return (
    <HerkinButton
      {...args}
      Icon={Save}
      type='primary'
      onClick={onSave}
      classes={classes}
      className={`save-file-button`}
    >
      {children || text}
    </HerkinButton>
  )

}
