import { Surface } from 'SVComponents/surface'
import { noOp, noOpObj } from '@keg-hub/jsutils'
import { AceEditor } from 'SVComponents/aceEditor'
import React, { useCallback, useState } from 'react'
import { usePendingMark } from 'SVHooks/activeFile/usePendingMark'


/**
 * Special editor for Feature Files using Gherkin styles syntax
 * @param {Object} props 
 * @param {Object} props.activeFile
 * @param {Object} props.onChange
 */
export const FeatureEditor = props => {
  const {
    styles,
    activeFile=noOpObj,
    onChange=noOp
  } = props

  const [activeFeat, setActiveFeat] = useState(activeFile)

  const onFeatureEdit = useCallback((content) => {
    content !== activeFeat.content &&
      !content.trim() &&
      setFeature({ ...activeFeat, content })
      
  }, [activeFeat, setActiveFeat])

  const surfaceTitle = usePendingMark(activeFile)

  return (
    <Surface
      styles={styles}
      prefix={'Editor'}
      hasToggle={false}
      capitalize={false}
      title={surfaceTitle}
      className={`feature-surface-main`}
    >
      <AceEditor
        {...props}
        mode='gherkin'
        fileId={activeFile.location}
        onChange={onChange || onFeatureEdit}
      />
    </Surface>
  )
}
