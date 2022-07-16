import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'
import { Values } from 'HKConstants'
import { EditorTabs } from './editorTabs'
import { EditorFromType } from './editorFromType'
import { useEditorActions } from './useEditorActions'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { useStyle, useDimensions } from '@keg-hub/re-theme'
import { ResizeHandle } from 'HKComponents/resize/resizeHandle'
import { useResizeHooks } from 'HKComponents/resize/useResizeHooks'
import {
  noOpObj,
  exists,
  isArr,
  isStr,
  noPropArr,
} from '@keg-hub/jsutils'

const { EDITOR_TABS, EDITOR_TYPES, CATEGORIES } = Values

/**
 * Gets the activeTab, and other tabs to display based on the activeFile type
 * Stores the activeTab state, and creates a callback to allow updating it
 */
const useEditorTabs = (activeFile, initialTab, editorStyles) => {
  // Get the fileType to use
  const fileType = activeFile.fileType
  // Get the tabs to display based on the active file type
  const editorTabs = EDITOR_TABS[fileType] || EDITOR_TABS.file

  // Memoize the initialTab or use the first defined tab
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
    if (cachedType === fileType) return

    setCachedType(fileType)
    setActiveTab(codeTab)
  }, [cachedType, fileType, codeTab])

  const onTabClick = useCallback(
    tab => {
      const clickedTab = isStr(tab) ? editorTabs[tab] : tab

      clickedTab &&
        activeTab?.id !== clickedTab.id &&
        setActiveTab(clickedTab)
    },
    [activeTab, setActiveTab, editorTabs]
  )

  const styles = useMemo(() => {
    /**
     * Find the style key to use when referencing the theme styles from the activeTab ID
     * When the ID is `split`, we use the editor names to identify the styles applied
     * example => editors: [ 'features', 'definitions' ] => 'features-definitions'
     * The 'features-definitions' key is used to get the styles
     * In theme/screens/editors.js there is a styles key for 'features-definitions'
     */
    const styleKey = activeTab?.editors?.length === 1
      ? 'full'
      : activeTab.id === 'split'
        ? activeTab.editors.join('-')
        : activeTab.id
    
    return editorStyles?.[styleKey] || noOpObj
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
  const {width:winWidth} = useDimensions()
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
      winWidth / editors.length,
      editors.length,
    ]
  }, [activeTabEditors, activeFileType, winWidth])
}

const RenderEditors = props => {
  const {
    setTab,
    styles,
    screenId,
    editorRef,
    activeTab,
    activeFile
  } = props

  const [editorsArr, editorWidth, editorCount] = useEditorsArr(
    activeTab.editors,
    activeFile?.fileType
  )

  const { pendingFiles = noOpObj } = useStoreItems([CATEGORIES.PENDING_FILES])

  const parentRef = useRef(null)
  const {
    dragging,
    leftWidth,
    onMouseUp,
    onMouseDown,
    onTouchStart,
  } = useResizeHooks(parentRef, editorWidth, 400)

  const addResize = editorCount > 1

  return editorsArr.reduce((components, editorType, idx) => {
    if(addResize && ((idx + 1) % 2) === 0){
      components.push(
        <ResizeHandle
          dragging={dragging}
          onTouchEnd={onMouseUp}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          key={`${activeTab.id}-${editorType}-resize`}
        />
      )
    }

    components.push(
      <EditorFromType
        setTab={setTab}
        styles={styles}
        screenId={screenId}
        editorRef={editorRef}
        editorType={editorType}
        activeFile={activeFile}
        key={`${activeTab.id}-${editorType}`}
        width={(addResize && idx === 0) ? leftWidth : undefined}
        editorId={`${activeTab.id}-${activeFile.fileType}-editor`}
        defaultValue={pendingFiles[activeFile?.location] || activeFile?.content || ''}
      />
    )

    return components
  }, [])
}


const onTabFuncs = []

/**
 * CodeEditor
 * @param {Object} props
 * @param {String} props.initialTab - Initial tab to start as active
 * @param {Object} props.activeFile - test file to load
 */
export const CodeEditor = props => {
  const { initialTab, activeFile = noOpObj, screenId } = props

  const editorStyles = useStyle(`screens.editors`)
  const actionsStyles = editorStyles?.actions

  const {
    styles,
    editorTabs,
    activeTab,
    onTabClick
  } = useEditorTabs(activeFile, initialTab, editorStyles)

  const editorRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const tabActions = useEditorActions(activeFile, editorRef, setIsSaving)

  const showEditorTabs = Boolean(
    activeFile.fileType === EDITOR_TYPES.FEATURE
    // || activeFile.fileType === EDITOR_TYPES.WAYPOINT
  )

  return exists(activeFile.content) ? (
    <>
      <RenderEditors
        styles={styles}
        setTab={onTabClick}
        screenId={screenId}
        editorRef={editorRef}
        activeTab={activeTab}
        activeFile={activeFile}
      />
      <EditorTabs
        showRun={true}
        tabs={editorTabs}
        screenId={screenId}
        isSaving={isSaving}
        styles={actionsStyles}
        activeFile={activeFile}
        activeTab={activeTab.id}
        onTabSelect={onTabClick}
        showEditorTabs={showEditorTabs}
        {...tabActions}
      />
    </>
  ) : null
}
