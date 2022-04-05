import React, {useMemo} from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import {
  ReRunning,
  ReMetaText,
  RecorderMain,
  RecorderTests,
  ReRecorderText,
} from './recorder.restyle'
const { CATEGORIES } = Values


const useSplitContent = (activeFile) => {
  return useMemo(() => activeFile.content.split(`\n`).map((line, idx) => ([line, idx])), [activeFile.content])
}


const RenderLine = props => {
  const {
    line,
  } = props

  return <ReMetaText className='recorder-text-meta'>{line}</ReMetaText>
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
  return (
    <RecorderMain className='recorder-main'>
      <RecorderTests className='recorder-tests'>
        <RenderRecorder {...props} />
      </RecorderTests>
    </RecorderMain>
  )
}
