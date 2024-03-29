import { tapColors } from '../../tapColors'
import { toggleState } from './toggleState'

const titleSize = 16
export const surface = theme => ({
  header: {
    // Overrides
    itemHeader: {
      main: {
        $web: {
          height: 35,
          borderBottomColor: tapColors.border,
          borderBottomWidth: 1,
          borderTopLeftRadius: tapColors.borderRadius,
          borderTopRightRadius: tapColors.borderRadius,
        },
      },
      content: {
        left: {
          main: {
            d: 'none',
          },
        },
        center: {
          main: {
            width: '70%',
            alI: 'start',
            pL: theme.padding.size,
          },
        },
        right: {
          main: {
            pR: theme.padding.size,
          },
        },
      },
    },
    toggle: toggleState(theme),
    heading: {
      ftWt: 'bold',
      ftSz: titleSize,
    },
    prefix: {
      ftSz: titleSize,
      c: tapColors?.defaultDark,
    },
    title: {
      ftSz: titleSize,
      c: tapColors?.success,
    },
  },
  content: {
    fl: 1,
  },
})
