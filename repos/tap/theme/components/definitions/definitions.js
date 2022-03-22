import { selectType } from './selectType'
import { definitionList } from './definitionList'
import { selectDefinition } from './selectDefinition'

export const definitions = theme => ({
  list: definitionList(theme),
  select: selectDefinition(theme),
  selectType: selectType(theme),
})
