import React, {useState, useEffect} from 'react'
import { useVisibleModal } from 'SVHooks/modal/useVisibleModal'
import { Screen } from './screens/screen'
import { FadeOut } from 'SVComponents/fadeOut'
import { SidebarContent } from 'SVComponents/sidebar'
import { useActiveFile } from 'SVHooks/activeFile/useActiveFile'
import {
  View,
  Sidebar,
  withAppHeader,
} from 'SVComponents'

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

export const RootContainer = withAppHeader('KeGherkin Editor', props => {
  const activeFile = useActiveFile()
  // Auto open the sidebar to allow selecting a file, if no file is already active
  const [sidebarToggled, setSidebarToggled] = useState(
    false
    // !useVisibleModal() && !Boolean(activeFile.location)
  )

  // TODO: Update this to use reStyle
  return (
    <View className={`tap-main`} style={{ fl: 1 }} >
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
    </View>
  )
})
