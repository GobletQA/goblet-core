import { body } from './body'
import { tabbarPortal } from './tabbarPortal'

export const domStyles = theme => ({
  ...body(theme),
  ...tabbarPortal(theme),
})
