import { themeConfig } from './theme.config.js'
import { deepMerge } from '@keg-hub/jsutils'
import { appHeader } from './appHeader'
import { domStyles } from './domStyles'
import { transition } from './transition'
import { tapColors } from './tapColors'
import { kegComponentsTheme } from 'SVTheme/kegComponentsTheme'
import { setDefaultTheme } from '@keg-hub/re-theme'
import { components } from './components'
import { screens } from './screens'

const kegTheme = kegComponentsTheme(themeConfig)

const theme = setDefaultTheme(
  deepMerge(
    kegTheme,
    components(kegTheme),
    {
      appHeader: appHeader(kegTheme),
      domStyles: domStyles(kegTheme),
      screens: screens(kegTheme),
      transition: transition(theme),
      tapColors
    },
  )
)

export {
  theme,
  tapColors
}