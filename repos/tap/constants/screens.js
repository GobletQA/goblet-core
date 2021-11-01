import { deepFreeze } from '@keg-hub/jsutils'

export const screens = deepFreeze({
  SCREENS: {
    EMPTY: 'empty',
    EDITOR: 'editor',
    SCREENCAST: 'screencast',
    RESULTS: 'results',
    // BUILDER: 'builder',
  },
})