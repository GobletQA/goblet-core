import { tapColors } from '../../tapColors'
import { deepMerge } from '@keg-hub/jsutils'
import { sharedShadow } from '../shared/shadow'

/**
 * Styles for the Screen Root component. NOT the Screencast Tabs
 */
export const screenTabs = (theme, defTabbar) =>
  deepMerge(defTabbar, {
    bar: {
      main: {
        top: 50,
        bgC: tapColors.headerBackground,
        left: theme.padding.size * 2 * -1,
        ...sharedShadow,
        position: 'fixed',
      },
      bottom: {},
      top: {},
    },
    tab: {
      default: {
        main: {
          flex: 1,
          margin: 0,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: tapColors.disabledColor,
          bgC: tapColors.accentBackground,
          ...theme.transition(['borderBottomColor', 'backgroundColor'], 0.8),
        },
        text: {
          marginBottom: 0,
          cursor: 'pointer',
          textAlign: 'center',
          color: tapColors.disabledColor,
          ...theme.transition(['color'], 0.8),
        },
        icon: {
          before: {},
          after: {},
        },
      },
      hover: {
        main: {
          borderBottomColor: tapColors.link,
          bgC: tapColors.sidebarBackground,
        },
        text: {
          color: tapColors.link,
        },
      },
      active: {
        main: {
          borderBottomColor: tapColors.primary,
          bgC: tapColors.sidebarBackground,
        },
        text: {
          color: tapColors.primary,
        },
      },
    },
  })
