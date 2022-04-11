import React, {useRef} from 'react'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { EditorFromType } from 'HKComponents/codeEditor/editorFromType'
import {
  RecorderMain,
} from './recorder.restyle'
const { CATEGORIES } = Values

export const Recorder = props => {
  const {
    styles,
    screenId,
    activeFile,
  } = props

  const editorRef = useRef(null)
  const { pendingFiles = noOpObj } = useStoreItems([CATEGORIES.PENDING_FILES])

  return (
    <RecorderMain className='recorder-main'>
      <EditorFromType
        styles={styles}
        screenId={screenId}
        editorRef={editorRef}
        activeFile={activeFile}
        editorType={activeFile.fileType}
        editorId={`recorder-${activeFile.fileType}-editor`}
        value={pendingFiles[activeFile?.location] || activeFile?.content || ''}
      />
    </RecorderMain>
  )
}
