import React, { useCallback, useState } from 'react'
import { Values } from 'HKConstants'
import { Save } from 'HKAssets/icons/save'
import { Times } from 'HKAssets/icons/times'
import { useSelector } from 'HKHooks/useSelector'
import { setActiveModal } from 'HKActions/modals'
import { noOp, noOpObj, flatArr, noPropArr } from '@keg-hub/jsutils'
import { MonacoEditor } from 'HKComponents/monacoEditor/monacoEditor'
import { useEditorFileName } from 'HKHooks/activeFile/useEditorFileName'
import { useSaveActiveFile } from 'HKHooks/activeFile/useSaveActiveFile'
import {
  Surface,
  SurfaceAction,
  SurfaceActionSpacer
} from 'HKComponents/surface'

const { CATEGORIES, MODAL_TYPES } = Values

/**
 * Special editor for Feature Files using Gherkin styles syntax
 * @param {Object} props
 * @param {Object} props.activeFile
 * @param {Object} props.onChange
 */
export const FeatureEditor = props => {
  const {
    styles,
    screenId,
    onChange=noOp,
    activeFile=noOpObj,
  } = props

  const { definitionTypes } = useSelector(CATEGORIES.DEFINITION_TYPES)

  const surfaceTitle = useEditorFileName(activeFile)
  const onSave = useSaveActiveFile({ activeFile, screenId })

  const onRemove = useCallback(() => {
    // TODO: Figure out some type of callback for when the modal is closed
    // If the file is removed need to handle the removal different based on file and screen type
    setActiveModal(
      MODAL_TYPES.CONFIRM_REMOVE_FILE,
      true,
      {activeFile, screenId}
    )
  }, [activeFile, screenId]) 

  const onMount = useCallback(async (editor, monaco) => {
    import('./addGherkinToMonaco')
      .then(({ addGherkinToMonaco }) => {
        const defs = flatArr(Object.values(definitionTypes), { truthy: true, exists: true })
          .map(def => ({
            suggestion: def.match,
            segments: [def.match],
            expression: def.variant,
          }))

        const findStepDefMatch = (matchText) => {
          return defs.filter(def => (
            def.suggestion
              .toLowerCase()
              .includes(matchText.toLowerCase())
          ))
        }
        addGherkinToMonaco(monaco, findStepDefMatch, noPropArr)
        /*
          TODO: For this to work, need something like Parkin.steps.match method
          Which will match feature step to a step definition
          text - feature step
          def - parsed definition
          Would then allow showing steps with no matching definition
          Use the getDefinitionFromId helper method to find the matching definition
          Looks something like
          getDefinitionFromId(definitionTypes, step.definition, step.type)
          configureMonaco(monaco, findStepDefMatch, defs.map(def => ({
            match: text => {
            }
          })))(editor)
        */
      })
  }, [definitionTypes])

  return (
    <Surface
      styles={styles}
      prefix={'Editor'}
      hasToggle={false}
      capitalize={false}
      title={surfaceTitle}
      className={`feature-surface-main`}
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
        {...props}
        mode='gherkin'
        onMount={onMount}
        onChange={onChange}
        fileId={activeFile.location}
      />
    </Surface>
  )
}
