import { tapColors } from '../tapColors'

export const body = theme => ({
  body: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    backgroundColor: tapColors.appBackground,
  },
  // Override the RN-Web element to all setting a full height on child elements
  [`#root > div > div > div`]: {
    flex: 1
  }
})