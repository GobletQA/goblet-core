
import React from 'react'
import { View } from 'SVComponents'
import { Values } from 'SVConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { FeatureEditor } from 'SVComponents/feature/featureEditor'
import { GeneralEditor } from 'SVComponents/aceEditor/generalEditor'
import { usePendingCallback } from 'SVHooks/activeFile/usePendingCallback'
import { DefinitionsEditor } from 'SVComponents/definition/definitionsEditor'

const { EDITOR_TYPES, SCREENS } = Values

const Container = reStyle(View)((theme, { width }) => ({
  width: `${width}%`,
}))

/**
 * EditorFromType Component - Renders the correct editor based on passed in props
 * @param {Object} props
 */
export const EditorFromType = props => {
  const {
    aceRef,
    styles,
    editorType,
    editorWidth,
    editorCount,
    activeFile=noOpObj,
    ...otherProps
  } = props
  const onChange = usePendingCallback(SCREENS.EDITOR)

  switch(editorType){
    case EDITOR_TYPES.FEATURE: {
      return (
        <Container
          width={editorWidth}
          editorCount={editorCount}
          className={`feature-editor-container`}
        >
          <FeatureEditor
            {...otherProps}
            aceRef={aceRef}
            onChange={onChange}
            activeFile={activeFile}
            styles={styles?.feature}
          />
        </Container>
      )
    }
    case EDITOR_TYPES.DEFINITIONS: {
      return (
        <Container
          width={editorWidth}
          editorCount={editorCount}
          className={`definitions-editor-container`}
        >
          <DefinitionsEditor
            {...otherProps}
            activeFile={activeFile}
            featureEditorRef={aceRef}
            styles={styles?.definitions}
          />
        </Container>
      )
    }
    default: {
      // TODO: Create an extention map to ace editor mode
      // Would allow setting the mode based on extention instead of hardcodeing it
      return (
        <Container
          width={editorWidth}
          editorCount={editorCount}
          className={`ace-editor-container`}
        >
          <GeneralEditor
            {...otherProps}
            aceRef={aceRef}
            onChange={onChange}
            mode={'javascript'}
            styles={styles?.editor}
            activeFile={activeFile}
            fileId={activeFile?.location}
          />
        </Container>
      )
    } 
  }

}