import { tapColors } from '../tapColors'

export const aceThemeOverrides = theme => {
  const padDouble = theme.padding.size * 2
  return {
    '.ace-chrome': {
      paddingBottom: padDouble
    },
    '.ace-herkin': {
      color: theme.colors.opacity._100,
      paddingBottom: padDouble
    },
    '.ace-chrome .ace_gutter, .ace-cucumber .ace_gutter': {
      background: tapColors.accentBackground,
    },
    '.ace_gutter .ace_gutter-layer .ace_gutter-active-line': {
        backgroundColor: '#e3e8f0',
    },
    '.gherkin-editor-wrapper': {
      overflowY: 'auto',
    },
  }
}
