import React, {useMemo, useState, useCallback} from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import { MonacoEditor } from 'HKComponents/monacoEditor/monacoEditor'
import {
  ReLineText,
  RecorderMain,
  RecorderLines,
} from './recorder.restyle'
const { CATEGORIES } = Values


const useSplitContent = (activeFile) => {
  return useMemo(() => activeFile.content.split(`\n`).map((line, idx) => ([line, idx])), [activeFile.content])
}


const RenderLine = props => {
  const {
    line,
  } = props

  return <ReLineText className='recorder-text-meta'>{line}</ReLineText>
}

const RenderRecorder = props => {
  const {activeFile} = props
  const splitContent = useSplitContent(activeFile)
  const { recordResults } = useSelector(CATEGORIES.RECORD_RESULTS)

  return splitContent.map(([line, key]) => {

    return (
      <RenderLine
        key={key}
        line={line}
        recordResults={recordResults}
      />
    )
  })
}


export const Recorder = props => {
  const {
    styles,
    activeFile,
    ...otherProps
  } = props
  
  // const [content, setContent] = useState(activeFile.content || '')
  const onChange = useCallback(() => {
    
  })

  const content = useMemo(() => {
    return activeFile.content
  }, [activeFile.content])

  return (
    <RecorderMain className='recorder-main'>
      <MonacoEditor
        {...otherProps}
        onChange={onChange}
        style={styles?.editor}
        activeFile={activeFile}
        fileId={activeFile?.location}
        value={content}
      />
      {/* <RecorderLines className='recorder-lines'>
        <RenderRecorder {...props} />
      </RecorderLines> */}
    </RecorderMain>
  )
}
