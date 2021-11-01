import { empty } from './empty'
import { editors } from './editors'
import { feature } from './feature'
import { results } from './results'
import { screencast } from './screencast'


export const screens = theme => ({
  empty: empty(theme),
  editors: editors(theme),
  feature: feature(theme),
  results: results(theme),
  screencast: screencast(theme),
})