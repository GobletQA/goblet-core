import React, {useMemo} from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import {
  ReRunning,
  ReMetaText,
  ReErrorIcon,
  ReSuccessIcon,
  ReHeaderText,
  ReErrorText,
  ReSuccessText,
  TrackerMain,
  TrackerTests,
  ReTrackerText,
} from './tracker.restyle'
const { CATEGORIES } = Values

const useSplitContent = (activeFile) => {
  return useMemo(() => activeFile.content.split(`\n`).map((line, idx) => ([line, idx])), [activeFile.content])
}

const useMappedResults = (line, specResults) => {
  return useMemo(() => specResults[line.trim()], [line, specResults])
}

const SuccessLine = props => {
  const { line, result } = props

  return (
    <ReSuccessText className='tracker-text-success'>
      {line}
      <ReSuccessIcon />
    </ReSuccessText>
  )
}

const ErrorLine = props => {
  const { line, result } = props

  return (
    <ReErrorText className='tracker-text-error'>
      {line}
      <ReErrorIcon />
    </ReErrorText>
  )
}

const RunningLine = props => {
  const { line } = props

  return (
    <ReTrackerText className='tracker-text-running'>
      {line}
      <ReRunning size='small' />
    </ReTrackerText>
  )
}

const MappedResult = props => {
  const { line, result } = props
  const { start, end } = result

  return start.id.includes('suite')
    ? <ReHeaderText className={`tracker-text-${start.type}`} >{line}</ReHeaderText>
    : !end
      ? (<RunningLine line={line} result={result} />)
      : end.status === `passed`
        ? (<SuccessLine line={line} result={result} />)
        : (<ErrorLine line={line} result={result} />)
}

const RenderLine = props => {
  const {
    line,
    specResults,
  } = props

  const mappedResult = useMappedResults(line, specResults)

  return !mappedResult || (!mappedResult.start && !mappedResult.end)
    ? line.startsWith(`@`)
      ? (<ReMetaText className='tracker-text-tag'>{line}</ReMetaText>)
      : (<ReMetaText className='tracker-text-meta'>{line}</ReMetaText>)
    : (<MappedResult line={line} result={mappedResult} />)
}

const RenderTracker = props => {
  const {activeFile} = props
  const splitContent = useSplitContent(activeFile)
  const { specResults } = useSelector(CATEGORIES.SPEC_RESULTS)

  return splitContent.map(([line, key]) => {

    return (
      <RenderLine
        key={key}
        line={line}
        specResults={specResults}
      />
    )
  })
}


export const Tracker = props => {
  return (
    <TrackerMain className='tracker-main'>
      <TrackerTests className='tracker-tests'>
        <RenderTracker {...props} />
      </TrackerTests>
    </TrackerMain>
  )
}
