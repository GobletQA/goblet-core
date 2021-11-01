import { screens } from './screens'
import { screencast } from './screencast'
import { parkinWorld } from './parkinWorld'

export const itemsState = {
  ...parkinWorld,
  ...screens,
  ...screencast,
}