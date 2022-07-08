import React, { useState } from 'react'
import { Screen } from './screens/screen'
import { Sidebar, View } from '@keg-hub/keg-components'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { withAppHeader } from 'HKComponents/hocs/withAppHeader'
import { useVisibleModal } from 'HKHooks/modal/useVisibleModal'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { SidebarContent } from 'HKComponents/sidebar/sidebarContent'

const sidebarProps = {
  to: 0,
  initial: -250,
  type: 'spring',
  sidebarWidth: 250,
  config: {
    speed: 5,
    bounciness: 1,
  },
  styles: {
    container: {
      minHeight: '100vh',
      paddingTop: 50,
    },
  },
}

const ReMain = reStyle(View)({
  fl: 1,
})

export const RootContainer = withAppHeader('Goblet Editor', props => {
  const activeFile = useActiveFile()
  // Auto open the sidebar to allow selecting a file, if no file is already active
  const [sidebarToggled, setSidebarToggled] = useState(
    false
    // !useVisibleModal() && !Boolean(activeFile.location)
  )

  return (
    <ReMain>
      <Sidebar
        {...sidebarProps}
        toggled={sidebarToggled}
        onToggled={setSidebarToggled}
      >
        <SidebarContent
          sidebarToggled={sidebarToggled}
          onSidebarToggled={setSidebarToggled}
        />
      </Sidebar>
      <Screen />
    </ReMain>
  )
})
