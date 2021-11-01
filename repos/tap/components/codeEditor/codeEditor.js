import React, { useRef, useMemo, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { Values } from 'SVConstants'
import { EditorTabs } from './editorTabs'
import { useStyle } from '@keg-hub/re-theme'
import { EditorFromType } from './editorFromType'
import { useActiveTab } from 'SVHooks/useActiveTab'
import { useEditorActions } from './useEditorActions'
import { useStoreItems } from 'SVHooks/store/useStoreItems'
import { noOpObj, exists, plural, isArr, isStr, noPropArr } from '@keg-hub/jsutils'

const { EDITOR_TABS, EDITOR_TYPES, CATEGORIES } = Values

/**
 * Gets the activeTab, and other tabs to display based on the activeFile type
 * Stores the activeTab state, and creates a callback to allow updating it
 */
const useEditorTabs = (activeFile, initialTab, editorStyles) => {
  // Get the fileType to use
  const fileType = activeFile.fileType
  // Get the tabs to display based on the active file type
  const editorTabs = EDITOR_TABS[fileType]

  // Momoize the initalTab or use the first defined tab
  const codeTab = useMemo(() => {
    return editorTabs[initialTab] || editorTabs[Object.keys(editorTabs)[0]]
  }, [editorTabs, initialTab])

  // Save that tab
  const [activeTab, setActiveTab] = useState(codeTab)
  const [cachedType, setCachedType] = useState(fileType)

  // Check if there was a fileType change
  // If there was, then update the saved activeTab to be the new codeTab
  // codeTab is the initial Tab used when a new file is loaded
  // Otherwise activeTab will still be cached from the last file
  useLayoutEffect(() => {
    if(cachedType === fileType) return

    setCachedType(fileType)
    setActiveTab(codeTab)
  }, [cachedType, fileType, codeTab])

  const onTabClick = useCallback(tab => {  
    const clickedTab = isStr(tab) ? editorTabs[tab] : tab
    clickedTab &&
      activeTab?.id !== clickedTab.id &&
      setActiveTab(clickedTab)
  }, [activeTab, setActiveTab, editorTabs])

  const styles = useMemo(() => {
    return editorStyles?.[
      activeTab?.editors?.length === 1
        ? 'full'
        : activeTab.id === 'split'
          /**
           * Join the names of the editors to dynamiclly build the key to reference the stlyes
           * Becuase the ID is `split`, we use the editor names to identify the styles applied
           * example => editors: [ 'features', 'definitions' ] => 'features-definitions'
           * The 'features-definitions' key is used to get the styles
           * In theme/screens/editors.js there is a styles key for 'features-definitions'
           */
          ? activeTab.editors.join('-')
          : activeTab.id
    ] || noOpObj
  }, [editorStyles, activeTab])

  return {
    styles,
    editorTabs,
    activeTab,
    onTabClick,
    setActiveTab,
  }
}

const useEditorsArr = (activeTabEditors, activeFileType) => {
  return useMemo(() => {
    const editors = isArr(activeTabEditors)
      ? activeTabEditors
      : isStr(activeTabEditors)
        ? [activeTabEditors]
        : activeFileType
          ? [activeFileType]
          : noPropArr
  
    return [
      editors,
      // Calc the width of each editor based on the number of editors to display
      100 / editors.length,
      editors.length
    ]
  }, [activeTabEditors, activeFileType])
}

const RenderEditors = (props) => {
  const {
    setTab,
    styles,
    editorRef,
    activeTab,
    activeFile,
  } = props

  const [
    editorsArr,
    editorWidth,
    editorCount,
  ] = useEditorsArr(
    activeTab.editors,
    activeFile?.fileType
  )
  
  const {pendingFiles=noOpObj} = useStoreItems([CATEGORIES.PENDING_FILES])

  return editorsArr.map(editorType => {
    return (
      <EditorFromType
        setTab={setTab}
        styles={styles}
        aceRef={editorRef}
        editorType={editorType}
        activeFile={activeFile}
        editorCount={editorCount}
        editorWidth={editorWidth}
        key={`${activeTab.id}-${editorType}`}
        editorId={`${activeTab.id}-${activeFile.fileType}-editor`}
        value={pendingFiles[activeFile?.location] || activeFile?.content || ''}
      />
    )
  })
}

/**
 * CodeEditor
 * @param {Object} props
 * @param {String} props.initialTab - Initial tab to start as active
 * @param {Object} props.activeFile - test file to load
 */
export const CodeEditor = props => {
  const {
    initialTab,
    activeFile=noOpObj
  } = props

  const editorStyles = useStyle(`screens.editors`)
  const actionsStyles = editorStyles?.actions

  const {
    styles,
    editorTabs,
    activeTab,
    onTabClick,
    setActiveTab,
  } = useEditorTabs(
    activeFile,
    initialTab,
    editorStyles
  )

  const editorRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const tabActions = useEditorActions(activeFile, editorRef, setIsSaving)

  return exists(activeFile.content)
    ? (<>
        <RenderEditors
          styles={styles}
          setTab={onTabClick}
          editorRef={editorRef}
          activeTab={activeTab}
          activeFile={activeFile}
        />
        <EditorTabs
          showRun={true}
          tabs={editorTabs}
          activeTab={activeTab.id}
          isSaving={isSaving}
          styles={actionsStyles}
          onTabSelect={onTabClick}
          showFeatureTabs={activeFile.fileType === EDITOR_TYPES.FEATURE}
          { ...tabActions }
        />
      </>)
    : null
}