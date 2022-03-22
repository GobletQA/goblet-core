import { tapColors } from '../../tapColors'
import { deepMerge } from '@keg-hub/jsutils'
import { sharedShadow } from '../shared/shadow'

export const reportsTabs = (theme, defTabbar) =>
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
        zIndex: 20,
      },
    },
    tab: {
      default: {
        main: {
          alI: 'flex-end',
          mR: theme.margin.size,
        },
      },
    },
  })
