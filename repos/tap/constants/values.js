import { tabs } from './tabs'
import { tests } from './tests'
import { types } from './types'
import { screens } from './screens'
import { categories } from './categories'
import { screencast } from './screencast'

export const Values = {
  EMPTY_STEP: `None Selected`,
  EMPTY_PARAM: `PARAMETER`,
  VERTICAL_BAR_HEIGHTS: 170,
  CREATE_NEW_FILE: 'Create New File',
  KEG_DOM_STYLES_ID: 'keg-dom-styles',
  ...screens,
  ...tests,
  ...categories,
  ...tabs,
  ...screencast,
  ...types,
}
