import React from 'react'
import { RenderOutput } from './renderOutput'
import { useActiveTestRuns } from 'HKHooks/activeFile/useActiveTestRuns'
import { ReCmdRow, ReCmdMain, ReCmdSurface } from './cmd.restyle'

export const CmdOutput = props => {
  const { activeFile } = props
  const testRunModel = useActiveTestRuns()

  return (
    <ReCmdSurface
      className={`cmd-main`}
      prefix={`Test Output`}
      title={activeFile.name}
      capitalize={false}
    >
      <ReCmdMain className={`cmd-grid`}>
        <ReCmdRow className='cmd-cmd-row'>
          <RenderOutput testRunModel={testRunModel} testFile={activeFile} />
        </ReCmdRow>
      </ReCmdMain>
    </ReCmdSurface>
  )
}
