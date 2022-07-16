import { user } from './user'
import { repo } from './repo'
import { repos } from './repos'
import { screens } from './screens'
import { screencast } from './screencast'
import { specResults } from './specResults'

export const itemsState = {
  ...user,
  ...repo,
  ...repos,
  ...screens,
  ...screencast,
  ...specResults,
}
