import React from 'react'
import { Save } from 'HKAssets/icons/save'
import { GobletButton } from './button.restyle'
import { useSaveActiveFile } from 'HKHooks/activeFile/useSaveActiveFile'

/**
 * SaveFileButton - Component saving a file
 * @param {Object} props
 * @param {Object} props.activeFile - Current active fileModel
 * @param {Object} props.onSave - Callback called when the button is clicked
 *
 */
export const SaveFileButton = props => {
  const { children, text = 'Save File', ...args } = props
  const onSave = useSaveActiveFile(args)

  return (
    <GobletButton
      {...args}
      Icon={Save}
      type='primary'
      onClick={onSave}
      classPrefix='save-file'
    >
      {children || text}
    </GobletButton>
  )
}
