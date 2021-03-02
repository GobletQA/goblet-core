import { Values } from 'SVConstants'
import { getStore } from 'SVStore'
import { EditorTabs } from './editorTabs'
import { noOpObj, exists } from '@keg-hub/jsutils'
import { AceEditor } from 'SVComponents/aceEditor'
import React, { useRef, useCallback } from 'react'
import { useActiveTab } from 'SVHooks/useActiveTab'
import { useStyle } from '@keg-hub/re-theme'
import { FeatureEditor } from 'SVComponents/feature/featureEditor'
import { DefinitionsEditor } from 'SVComponents/definition/definitionsEditor'
import { saveFile } from 'SVActions/files'
import { removePendingFile, setPendingFile } from 'SVActions/files/local'

const { EDITOR_TABS } = Values

/**
 * MainEditor
 * @param {Object} props
 * @param {Object} props.activeFile
 */
const MainEditor = props => {
  const { activeFile } = props

  const onChange = useCallback((text) => {
    // it's possible that the local activeFile is not in sync with the store's activeFile when this callback is called
    // * this happens when you switch files
    // so fetch from the store to ensure latest value 
    const { items } = getStore().getState()
    text && text === items?.activeFile?.content
      ? removePendingFile()
      : setPendingFile(text)
  }, [])

  return activeFile?.fileType === 'feature'
    ? (
      <FeatureEditor
        {...props}
        // onChange={setActiveFilePendingContent}
        editorId={`feature-editor`}
      />
    )
    : (
      <AceEditor
        {...props}
        onChange={onChange}
        editorId={`code-editor`}
        mode={'javascript'}
      />
    )
}

/**
 * Hook to run the active files tests, or save changes to the active file
 */
const useTabActions = (props) => {
  const { editorRef } = props
  
  const onRun = useCallback(event => {
    console.log('---Run tests---')
  }, [])

  const onSave = useCallback(async setIsSaving => {
    // saves file and remove it from the pending store if successful
    if (editorRef.current) {
      setIsSaving(true)
      const result = await saveFile({content: editorRef.current?.editor?.getValue()})
      result?.success && removePendingFile(result?.location)
    }
    setIsSaving(false)
  }
    , 
    [ editorRef.current ]
  )

  return { onRun, onSave }
}

/**
 * CodeEditor
 * @param {Object} props
 * @param {String} props.activeTab
 * @param {Object} props.activeFile - test file to load
 */
export const CodeEditor = props => {
  const {
    activeTab,
    activeFile=noOpObj
  } = props
  const [ tab, setTab ] = useActiveTab(activeTab || EDITOR_TABS.SPLIT)
  const forceFull = !activeFile.isFeature && (tab === EDITOR_TABS.SPLIT || tab === EDITOR_TABS.DEFINITIONS)
  const checkTab = forceFull ? EDITOR_TABS.FEATURE : tab
  const editorRef = useRef(null)
  const tabActions = useTabActions({...props, editorRef})
  const editorStyles = useStyle(`screens.editors`)
  const codeStyles = editorStyles?.[checkTab]
  const actionsStyles = editorStyles?.actions
  
  if (!exists(activeFile.content)) return null

  /* TODO: Clean up constants and Actions tab
    * Constants
      * FEATURE should be it's own constant
        * Currently used for features && non-definition files
      * Need to add constants for waypoint and jest test files
        * Should show the Run and save action in the Actions tab
      * Need to add constant for non-test and non-definition files
        * Should show only save action in the Actions tab
    * Actions Tab ( In the EditorTabs component )
      * Run action should be disabled only for test files
        * feature / waypoint / jest
        * Currently hidden for all except feature files
  */

  return (
    <>
      {(tab === EDITOR_TABS.FEATURE || tab === EDITOR_TABS.SPLIT) && (
        <MainEditor
          aceRef={editorRef}
          key={`${tab}-feature`}
          activeFile={activeFile}
          setTab={setTab}
          value={activeFile?.modified || activeFile?.content || ''}
          style={codeStyles.feature || codeStyles}
        />
      )}
      {(tab === EDITOR_TABS.DEFINITIONS ||tab === EDITOR_TABS.SPLIT) &&
        activeFile?.isFeature && (
          <DefinitionsEditor
            featureEditorRef={editorRef}
            activeFile={activeFile}
            key={`${tab}-definitions`}
            editorId={`definitions-editor`}
            styles={codeStyles.definitions || codeStyles}
          />
      )}
      <EditorTabs
        activeTab={checkTab}
        onTabSelect={setTab}
        showFeatureTabs={activeFile.isFeature}
        styles={actionsStyles}
        { ...tabActions }
      />
    </>
  )
}