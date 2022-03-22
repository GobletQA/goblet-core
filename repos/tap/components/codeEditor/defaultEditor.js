
import React, { useCallback } from 'react'
import { Values } from 'HKConstants'
import { Save } from 'HKAssets/icons/save'
import { Times } from 'HKAssets/icons/times'
import { noOp, noOpObj } from '@keg-hub/jsutils'
import { setActiveModal } from 'HKActions/modals'
import { MonacoEditor } from 'HKComponents/monacoEditor/monacoEditor'
import { useEditorFileName } from 'HKHooks/activeFile/useEditorFileName'
import { useSaveActiveFile } from 'HKHooks/activeFile/useSaveActiveFile'
import {
  Surface,
  SurfaceAction,
  SurfaceActionSpacer
} from 'HKComponents/surface'

const { MODAL_TYPES } = Values

/**
 * Special editor for Feature Files using Gherkin styles syntax
 * @param {Object} props
 * @param {Object} props.activeFile
 * @param {Object} props.onChange
 */
export const DefaultEditor = props => {
  const {
    screenId,
    styles,
    onChange=noOp,
    activeFile = noOpObj,
    ...otherProps
  } = props

  const surfaceTitle = useEditorFileName(activeFile)

  const onRemove = useCallback(() => {
    setActiveModal(
      MODAL_TYPES.CONFIRM_REMOVE_FILE,
      true,
      {activeFile, screenId}
    )
  }, [activeFile, screenId]) 

  const onSave = useSaveActiveFile({ activeFile, screenId })

  return (
    <Surface
      styles={styles}
      prefix={'Editor'}
      hasToggle={false}
      capitalize={false}
      title={surfaceTitle}
      className={`default-surface-main`}
      RightComponent={(
        <>
          <SurfaceAction
            Icon={Save}
            text={'SAVE'}
            onPress={onSave}
          />
          <SurfaceActionSpacer />
          <SurfaceAction
            Icon={Times}
            text='DELETE'
            type='danger'
            onPress={onRemove}
          />
        </>
      )}
    >
      <MonacoEditor
        {...otherProps}
        onChange={onChange}
        style={styles?.editor}
        activeFile={activeFile}
        fileId={activeFile?.location}
      />
    </Surface>
  )
}
