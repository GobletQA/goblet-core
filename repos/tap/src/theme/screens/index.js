import { empty } from './empty'
import { editors } from './editors'
import { feature } from './feature'

export const screens = theme => ({
  empty: empty(theme),
  editors: editors(theme),
  feature: feature(theme),
})
