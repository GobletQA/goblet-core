import React, {useRef, useCallback, useEffect} from 'react'
import { Values } from 'HKConstants'
import { RecorderMain } from './recorder.restyle'
import { useSelector } from 'HKHooks/useSelector'
import { noOpObj, noPropArr } from '@keg-hub/jsutils'
import { EditorFromType } from 'HKComponents/codeEditor/editorFromType'
import { setRecordLineNumber } from 'HKActions/recorder/local/setRecordLineNumber'

const { CATEGORIES } = Values

const addInsertMarker = (editor, target, decorationsRef, addToStore=false) => {
  const { range } = target

  decorationsRef.current = editor.deltaDecorations(
    decorationsRef.current || noPropArr,
    [{ 
        range: target.range,
        options: {
        className: 'editor-insert-line',
        glyphMarginClassName: 'editor-glyph-margin',
        glyphMarginHoverMessage: 'Code insert location',
      }
    }]
  )

  addToStore && setRecordLineNumber({...range})
}

export const Recorder = props => {
  const {
    styles,
    screenId,
    activeFile,
  } = props

  const editorRef = useRef(null)

  const {
    recordingActions,
    pendingFiles = noOpObj,
  } = useSelector(CATEGORIES.PENDING_FILES, CATEGORIES.RECORDING_ACTIONS)

  const decorationsRef = useRef([])

  const onMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    editor.onMouseDown(({ event, target }) => {
      // Ensure the click is the glyph column
      if(target.mouseColumn !== 1) return

      addInsertMarker(editor, target, decorationsRef, true)
    })

    if(!recordingActions.range) return

    addInsertMarker(editor, recordingActions, decorationsRef)
  }, [])


  useEffect(() => {
    if(!editorRef.current || !decorationsRef?.current?.length || !recordingActions?.range?.startLineNumber)
      return

    const editor = editorRef.current
    const editorModel = editor.getModel()
    const currentRange = editorModel.getDecorationRange(decorationsRef.current[0])

    // If no range found, then just return
    if(!currentRange?.startLineNumber) return

    const notEqual = currentRange.startLineNumber !== recordingActions?.range?.startLineNumber
    // If the currentRange is not equal to the store range, then update it
    notEqual && addInsertMarker(editor, recordingActions, decorationsRef)

  }, [recordingActions.range, decorationsRef.current])

  return (
    <RecorderMain className='recorder-main'>
      <EditorFromType
        styles={styles}
        onMount={onMount}
        glyphMargin={true}
        screenId={screenId}
        activeFile={activeFile}
        editorType={activeFile.fileType}
        editorId={`recorder-${activeFile.fileType}-editor`}
        value={pendingFiles[activeFile?.location] || activeFile?.content || ''}
      />
    </RecorderMain>
  )
}
