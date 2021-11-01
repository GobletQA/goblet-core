import { tapColors } from '../tapColors'
import { sharedScreen } from './shared'

const surfaceShared = {
  mL: 5,
  mR: 5,
} 

export const screencast = theme => {
  return {
    ...sharedScreen,
    screencast: {
      surface: {
        // Styles for the Surface wrapping the canvas
        canvas: {
          main: {
            ...surfaceShared,
            fl: 1,
            maxW: `70vw`,
          },
          content: {
            // Set styles related to the screencast - surface - row component
          }
        },
        // Styles for the Surface wrapping the tracker
        tracker: {
          main: {
            ...surfaceShared,
            fl: `0 0 30vw`,
            minW: `30vw`
          },
          content: {
            // Set styles related to the screencast - surface - row component
          }
        }
      }
    }
  }
}
