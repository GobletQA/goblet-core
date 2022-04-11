import React, {useMemo, useCallback} from 'react'
import { checkCall } from '@keg-hub/jsutils'
import { NoActiveDefinition } from './noActiveDefinition'
import { MonacoEditor } from 'HKComponents/monacoEditor/monacoEditor'
import { removePendingFile, setPendingFile } from 'HKActions/files/local'

/**
 * ActiveDefinitionsEditor - Renders an editor to modify a definition file
 * @param {Object} props
 * @param {Array} props.definitions - Loaded definition for the backend as fileModels
 * @param {Object} props.styles - Custom styles for displaying the component
 *
 * @returns {Component}
 */
export const ActiveDefinitionsEditor = React.memo(props => {
  const {
    styles,
    activeDefinition:definition,
  } = props

  const editorProps = useMemo(() => {
    return {
      wrapBehavioursEnabled: true,
      animatedScroll: false,
      dragEnabled: false,
      tabSize: 2,
      wrap: true,
      ...props.editorProps,
    }
  }, [props.editorProps])

  const onChange = useCallback(text => {
    checkCall(props.onChange, definition.uuid, text)

    if(!definition || !text) return
    
    definition.content !== text
      ? setPendingFile(text, definition)
      : removePendingFile(definition)
  }, [props.onChange, definition])

  return definition ? (
    <MonacoEditor
      fileId={definition.uuid}
      key={definition.keyId || definition.uuid}
      {...props}
      mode='javascript'
      onChange={onChange}
      style={styles?.editor}
      editorProps={editorProps}
      defaultValue={definition.content || ''}
      editorId={`definition-editor-${definition.uuid}`}
    />
  ) : (
    <NoActiveDefinition />
  )
})
