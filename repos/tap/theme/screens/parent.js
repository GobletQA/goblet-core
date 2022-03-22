import { tapColors } from '../tapColors'

export const parent = theme => ({
  main: {
    $web: {
      tp: 0,
      mT: 100,
      mW: `100vw`,
    },
    $all: {
      zI: -1,
      ovf: 'scroll',
      pos: 'relative',
      pH: theme?.padding?.size / 2,
      bgC: tapColors.appBackground,
    },
  },
})
