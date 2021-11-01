import React, { useState, useEffect } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { keg } from 'SVConfig'
import { getStore } from 'SVStore'
import { Provider } from 'react-redux'
import { WSService } from 'SVServices'
import { getHistory } from 'SVNavigation'
import { isNative } from 'SVUtils/platform'
import { Router } from 'SVComponents/router'
import { FadeOut } from 'SVComponents/fadeOut'
import { SockrProvider } from '@ltipton/sockr'
import { initAppAction, init } from 'SVActions'
import { checkCall, get } from '@keg-hub/jsutils'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { theme, tapColors } from 'SVTheme/tapIndex'
import { ContainerRoutes } from 'SVNavigation/containerRoutes'
import { ReThemeProvider, getDefaultTheme } from '@keg-hub/re-theme'
import { View, Text, ModalManager, DomStyles, Toast } from 'SVComponents'

// Uncomment to see sockr logs in development
// const sockrDebug = process.env.NODE_ENV !== 'production'
// Remove to see sockr logs in development
const sockrDebug = false

const checkAppInit = async (setApiTimeout) => {
  let timeout
  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return init()
      .then(() => res(clearTimeout(timeout)))
  })
  .then(() => checkCall(initAppAction))
  .catch(() => setApiTimeout(`Backend API Server is not responding`))
}

const Timeout = reStyle(Text)({txAl: 'center'})
const AppMain = reStyle(View)({
  fl: 1,
  w: '100%',
  mW: '100%',
  bgC: tapColors.appBackground,
})

const App = props => {
  const [ activeTheme, switchTheme ] = useState(getDefaultTheme())
  const [ apiTimeout, setApiTimeout ] = useState(false)

  useEffect(() => checkAppInit(setApiTimeout), [])

  return (
    <>
      <StatusBar barStyle={'default'} />
      <Router history={getHistory()}>
        <SafeAreaView>
          <Provider store={getStore()}>
            <ReThemeProvider theme={ activeTheme } >
              <DomStyles />
              <SockrProvider
                debug={sockrDebug}
                config={WSService}
              >
                <AppMain>
                  <ContainerRoutes navigationConfigs={keg.routes}/>
                  <ModalManager />
                  <Toast />
                </AppMain>
                <FadeOut>
                  {apiTimeout && (<Timeout>{apiTimeout}</Timeout>)}
                </FadeOut>
              </SockrProvider>
            </ReThemeProvider>
          </Provider>
        </SafeAreaView>
      </Router>
    </>
  )
}

export default App
