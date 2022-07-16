import { tapColors } from './tapColors'
import { noOpObj } from '@keg-hub/jsutils'

const borderColors = {
  borderColor: tapColors.borderInput,
  borderTopColor: tapColors.borderInput,
  borderLeftColor: tapColors.borderInput,
  borderRightColor: tapColors.borderInput,
  borderBottomColor: tapColors.borderInput,
}

/**
 * Keg-Components input is broken
 * So the styles are split into two parts
 * Here, and in components/form/input
 */
const inputStyle = {
  height: 35,
  padding: 7.5,
  flexGrow: 2,
  fontSize: 14,
  borderWidth: 1,
  borderRadius: 0,
  overflow: 'hidden',
  borderStyle: 'solid',
  backgroundColor: tapColors.white,
  ...borderColors,
}

const input = {
  default: {
    ...borderColors
  },
  pre: {
    ...inputStyle,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  post: {
    ...inputStyle,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
}

export const themeConfig = {
  defaults: {
    colors: {
      types: {
        default: { palette: "tapDefault" },
        primary: { palette: "tapPrimary" },
        secondary: { palette: "tapSecondary" },
        warn: { palette: "tapWarn" },
        danger: { palette: "tapDanger" },
        // link: { palette: "tapLink" },
        // info: { palette: "tapInfo" },
      },
      palette: {
        tapDefault: [
          20,
          tapColors.gray,
          -20
        ],
        tapPrimary: [
          tapColors.primaryLight,
          tapColors.primary,
          -20
        ],
        tapSecondary: [
          tapColors.successLight,
          tapColors.success,
          tapColors.successDark
        ],
        tapWarn: [
          tapColors.warnLight,
          tapColors.warn,
          tapColors.warnDark
        ],
        tapDanger: [
          tapColors.dangerLight,
          tapColors.danger,
          tapColors.dangerDark
        ],
        // tapLink: [
        //   tapColors.linkLight,
        //   tapColors.link,
        //   tapColors.linkDark
        // ],
        // tapInfo: [
        //   tapColors.infoLight,
        //   tapColors.info,
        //   tapColors.infoDark
        // ]
      }
    }
  },
  input,
  select: {
    default: {
      main: {
        ...input.default,
        padding: 0,
      },
    },
    pre: {
      main: {
        ...input.pre,
        padding: 0,
      }
    },
    post: {
      main: {
        ...input.post,
        padding: 0,
      }
    },
  },
  section: {
    default: {
      $all: {
        p: 0,
        m: 0,
        bW: 0,
        bRad: 3,
        minH: 200,
        bgC: tapColors.white,
      },
    },
  },
  typography: {
    font: {
      family: {
        $all: {
          fontFamily: tapColors.fontFamily,
        },
        $native: {},
        $web: {
          fontFamily: tapColors.fontFamily,
        },
      },
    },
  },
}
