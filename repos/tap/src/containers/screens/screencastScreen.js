import React from 'react'
import { Values } from 'HKConstants'
import { EmptyScreen } from './index'
import { capitalize } from '@keg-hub/jsutils'
import { RsScreenMain } from './screens.restyle'
import { useIsSCRunning } from 'HKHooks/screencast'
import { Screencast } from 'HKComponents/screencast/screencast'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { AsideCmdOutput } from 'HKComponents/cmdOutput/asideCmdOutput'

const { SCREENS } = Values

const ScreencastScreen = ({ styles, ...props }) => {
  const { isRunning } = useIsSCRunning()
  const activeFile = useActiveFile(SCREENS.SCREENCAST)

  return !activeFile?.fileType ? (
    <EmptyScreen message={'No file selected!'} />
  ) : (
    <RsScreenMain className={`screencast-screen`}>
      <Screencast
        {...props}
        isRunning={isRunning}
        activeFile={activeFile}
        screenId={SCREENS.SCREENCAST}
        title={capitalize(activeFile?.fileType || '')}
        tests={activeFile?.modified || activeFile?.content || ''}
      />
      <AsideCmdOutput activeFile={activeFile} />
    </RsScreenMain>
  )
}

export default ScreencastScreen