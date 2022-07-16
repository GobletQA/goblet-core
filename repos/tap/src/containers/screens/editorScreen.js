import React from 'react'
import { EmptyScreen } from './index'
import { ReEditorMain } from './screens.restyle'
import { CodeEditor } from 'HKComponents/codeEditor'
import { Resize } from 'HKComponents/resize/resize'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { AsideCmdOutput } from 'HKComponents/cmdOutput/asideCmdOutput'

/**
 * EditorScreen - Renders code editors based on the type of file selected
 * @param {Object} props
 * @param {String} props.id - Id of the Editor screen
 * @param {Object} props.styles - Custom override styles for the editor
 * @param {Object} props.title - Display name for the screen
 *
 */
const EditorScreen = props => {
  const activeFile = useActiveFile(props.id)

  return !activeFile?.fileType ? (
    <EmptyScreen message={'No file selected!'} />
  ) : (
    <ReEditorMain className='goblet-editor-screen-main' >
      <CodeEditor activeFile={activeFile} screenId={props.id} />
      <AsideCmdOutput activeFile={activeFile} screenId={props.id} />
    </ReEditorMain>
  )
}

export default EditorScreen