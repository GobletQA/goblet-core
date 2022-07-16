import { tapColors } from '../../tapColors'
import { deepMerge } from '@keg-hub/jsutils'
import { sharedShadow } from '../shared/shadow'

export const codeTabs = (theme, defTabbar) =>
  deepMerge(defTabbar, {
    main: {
      left: 0,
      bottom: 0,
      zIndex: 4,
      position: 'fixed',
    },
    container: {},
    tabview: {
      display: 'none',
    },
    bar: {
      main: {
        top: 'initial',
        left: 'initial',
        bottom: 'initial',
        position: 'initial',
        bgC: tapColors.headerBackground,
        ...sharedShadow,
        shadowOffset: { width: 0, height: -2 },
        zIndex: 20,
      },
    },
    tab: {},
  })
