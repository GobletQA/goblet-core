import { tapColors } from '../../tapColors'

const defaultStyles = (theme, isChildNode) => {
  const childDefaultStyle = isChildNode && {
    bgC: tapColors?.accentBackground,
    borderBottomWidth: 0,
  }
  return {
    folder: {
      main: {
        ...childDefaultStyle,
      },
    },
    file: {
      main: {
        ...childDefaultStyle,
      },
    },
  }
}

const activeStyles = (theme, isChildNode) => {
  return {
    folder: {
      main: {},
      text: {
        c: tapColors?.primary,
      },
    },
    file: {
      main: {
        bgC: tapColors?.accentBackground,
        borderBottomWidth: 0,
      },
      text: {
        c: tapColors?.success,
      },
    },
  }
}

const hoverStyles = (theme, isChildNode) => {
  const childHoverStyle = isChildNode && {
    bgC: tapColors?.headerBackground,
    borderBottomWidth: 0,
  }
  return {
    folder: {
      main: {
        ...childHoverStyle,
      },
      text: {
        c: tapColors?.primary,
      },
    },
    file: {
      main: {
        ...childHoverStyle,
      },
      text: {
        c: tapColors?.success,
      },
    },
  }
}

export const treeList = theme => ({
  default: {
    root: defaultStyles(theme),
    child: defaultStyles(theme, true),
  },
  hover: {
    root: hoverStyles(theme),
    child: hoverStyles(theme, true),
  },
  active: {
    root: activeStyles(theme),
    child: activeStyles(theme, true),
  },
})
