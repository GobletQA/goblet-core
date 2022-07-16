import { Values } from 'HKConstants'
const { CATEGORIES, SCREENCAST_DEFAULTS, BROWSER_DEFAULTS } = Values

/**
 * Sets screencast store defaults from constants
 * @type Object
 *
 * @returns {void}
 */
export const screencast = {
  [CATEGORIES.SCREENCAST_STATUS]: {
    ...SCREENCAST_DEFAULTS,
  },
  [CATEGORIES.BROWSER_OPTS]: {
    ...BROWSER_DEFAULTS,
  },
  [CATEGORIES.RECORDING_BROWSER]: {
    isRecording: false
  },
  [CATEGORIES.RECORDING_ACTIONS]: {
    // lineNumber: 15,
    // range: {
    //   endColumn: 1,
    //   endLineNumber: 15,
    //   startColumn: 1,
    //   startLineNumber: 15
    // },
    actions: {},
    range: false,
    lineNumber: false,
  }
}
