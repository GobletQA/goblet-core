import React, {useCallback} from 'react'
import { Save } from 'HKAssets/icons/save'
import { GobletButton } from './button.restyle'
import { removeFile } from 'HKActions/files/api/removeFile'

/**
 * SaveFileButton - Component saving a file
 * @param {Object} props
 * @param {Object} props.activeFile - Current active fileModel
 * @param {Object} props.onSave - Callback called when the button is clicked
 *
 */
export const RemoveFileButton = props => {
  const { children, text = 'Remove File', ...args } = props
  
  const onRemoveFile = useCallback(() => {
    
    
  }, [])

  return (
    <GobletButton
      {...args}
      Icon={Save}
      type='primary'
      onClick={removeFile}
      classPrefix='save-file'
    >
      {children || text}
    </GobletButton>
  )
}
