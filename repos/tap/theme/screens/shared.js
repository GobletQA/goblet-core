import { tapColors } from '../tapColors'

export const sharedScreen = {
  main: {
    fl: 1, 
    w: `100%`,
    flD: 'column',
  },
  iFrame: {
    surface: {
      main: {
        fl:1, 
      }, 
      content: {
        fl:1,
      }
    },
    header: {
      main: {
        flD: 'row', 
        alI: 'center'
      },
      icon: {
        container: {
          pL: 8
        },
        color: tapColors.primary, 
        size: 18
      }
    }
  },
}