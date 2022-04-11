import React from 'react'
import { Values } from 'HKConstants'
import { DefaultEditor } from './defaultEditor'
import { noOpObj, capitalize } from '@keg-hub/jsutils'
import { ReResizeContainer } from './codeEditor.restyle'
import { Screencast } from 'HKComponents/screencast/screencast'
import { FeatureEditor } from 'HKComponents/feature/featureEditor'
import { usePendingCallback } from 'HKHooks/activeFile/usePendingCallback'
import { DefinitionsEditor } from 'HKComponents/definition/definitionsEditor'

const {
  SCREENS,
  EDITOR_TYPES,
  EDITOR_MODE_TYPES
} = Values

/**
 * EditorFromType Component - Renders the correct editor based on passed in props
 * @param {Object} props
 */
export const EditorFromType = props => {
  const {
    editorRef,
    styles,
    width,
    editorType,
    activeFile = noOpObj,
    ...otherProps
  } = props

  const onChange = usePendingCallback(SCREENS.EDITOR)
  const editorMode = EDITOR_MODE_TYPES[editorType] || EDITOR_MODE_TYPES.default

  switch (editorType) {
    case EDITOR_TYPES.FEATURE: {
      return (
        <ReResizeContainer
          width={width}
          className={`feature-editor-container`}
        >
          <FeatureEditor
            {...otherProps}
            mode={editorMode}
            onChange={onChange}
            editorRef={editorRef}
            activeFile={activeFile}
            styles={styles?.feature}
          />
        </ReResizeContainer>
      )
    }
    case EDITOR_TYPES.DEFINITIONS: {
      return (
        <ReResizeContainer
          width={width}
          className={`definitions-editor-container`}
        >
          <DefinitionsEditor
            {...otherProps}
            mode={editorMode}
            activeFile={activeFile}
            featureEditorRef={editorRef}
            styles={styles?.definitions}
          />
        </ReResizeContainer>
      )
    }
    case EDITOR_TYPES.SCREENCAST: {
      return (
        <ReResizeContainer
          width={width}
          className={`default-editor-container`}
        >
          <Screencast
            {...otherProps}
            hideTracker
            styles={styles}
            isRunning={false}
            activeFile={activeFile}
            title={capitalize(activeFile?.fileType || '')}
            tests={activeFile?.modified || activeFile?.content || ''}
          />
        </ReResizeContainer>
      )
    }
    default: {
      return (
        <ReResizeContainer
          width={width}
          className={`default-editor-container`}
        >
          <DefaultEditor
            {...otherProps}
            styles={styles}
            onChange={onChange}
            mode={editorMode}
            editorRef={editorRef}
            activeFile={activeFile}
            fileId={activeFile?.location}
          />
        </ReResizeContainer>
      )
    }
  }
}
