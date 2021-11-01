import { Surface } from 'SVComponents/surface'
import { noOp, noOpObj } from '@keg-hub/jsutils'
import { AceEditor } from 'SVComponents/aceEditor'
import React, { useCallback, useState } from 'react'
import { usePendingMark } from 'SVHooks/activeFile/usePendingMark'

/**
 * General Editor for most file type
 * Wrapped in a surface component for formatting
 * @param {Object} props
 * @param {Object} props.styles - Custom styles for the editor and surface
 * @param {Object} props.activeFile - File to be loaded in the editor
 * @param {Object} props.* - AceEditor props - See AceEditor Component
 *
 */
export const GeneralEditor = props => {
  const {
    styles,
    activeFile=noOpObj,
  } = props

  const surfaceTitle = usePendingMark(activeFile)

  return (
    <Surface
      styles={styles}
      prefix={'Editor'}
      hasToggle={false}
      capitalize={false}
      title={surfaceTitle}
      className={`general-surface-main`}
    >
      <AceEditor {...props} />
    </Surface>
  )
}