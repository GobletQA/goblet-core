import { themeConfig } from './theme.config.js'
import { deepMerge } from '@keg-hub/jsutils'
import { appHeader } from './appHeader'
import { domStyles } from './domStyles'
import { transition } from './transition'
import { tapColors } from './tapColors'
import { kegComponentsTheme } from 'HKTheme/kegComponentsTheme'
import { setDefaultTheme } from '@keg-hub/re-theme'
import { components } from './components'
import { screens } from './screens'

const kegTheme = kegComponentsTheme(themeConfig)

/**
 * Hack for select component to use the defaults for the custom types
 * Need a better way to do this, but this works for now
 */
kegTheme.form.select.post = deepMerge(
  kegTheme.form.select.default,
  kegTheme.form.select.post,
)

kegTheme.form.select.pre = deepMerge(
  kegTheme.form.select.default,
  kegTheme.form.select.pre,
)

const theme = setDefaultTheme(
  deepMerge(kegTheme, components(kegTheme), {
    appHeader: appHeader(kegTheme),
    domStyles: domStyles(kegTheme),
    screens: screens(kegTheme),
    transition: transition(kegTheme),
    tapColors,
  })
)

export { theme, tapColors }
