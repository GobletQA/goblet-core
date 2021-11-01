import React from 'react'
import { Values } from 'SVConstants'
import { Aside } from 'SVComponents/aside'
import { EmptyScreen } from './emptyScreen'
import { useStyle } from '@keg-hub/re-theme'
import { capitalize } from '@keg-hub/jsutils'
import { View } from '@keg-hub/keg-components'
import { Desktop } from 'SVAssets/icons/desktop'
import { CmdOutput } from 'SVComponents/cmdOutput/cmdOutput'
import { Screencast } from 'SVComponents/screencast/screencast'
import { useActiveFile } from 'SVHooks/activeFile/useActiveFile'
import { useIsSCRunning } from 'SVHooks/screencast'

const { SCREENS } = Values

const asideProps = {
  to: 0,
  type: 'spring',
  location: 'right',
  sidebarWidth: `40vw`,
  config: {
    speed: 20,
    bounciness: 1,
  },
  styles: {
    container: {
      minHeight: '90vh',
    },
  },
}

export const ScreencastScreen = ({ styles, ...props}) => {

  const { isRunning } = useIsSCRunning()
  const activeFile = useActiveFile(SCREENS.SCREENCAST)
  const builtStyles = useStyle(`screens.screencast`, styles)

  return !activeFile?.fileType
    ? (<EmptyScreen message={'No file selected!'} />)
    : (
        <View
          className={`screencast-screen`}
          style={builtStyles.main}
        >
          <Screencast
            {...props}
            isRunning={isRunning}
            activeFile={activeFile}
            title={capitalize(activeFile?.fileType || '')}
            tests={activeFile?.modified || activeFile?.content || ''}
            styles={builtStyles?.screencast}
          />
          <Aside {...asideProps}>
            <CmdOutput activeFile={activeFile} />
          </Aside>
        </View>
      )
}

ScreencastScreen.tabIcon = Desktop
ScreencastScreen.tabTitle = `Screencast`
ScreencastScreen.tabId = SCREENS.SCREENCAST
