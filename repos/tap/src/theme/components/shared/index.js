import { sharedButton, defaultButton } from './button'
import { sharedInput, sharedInputInline } from './input'
import { sharedSelect, sharedSelectInline } from './select'
import { sharedShadow } from './shadow'

const shared = theme => {
  return {
    input: sharedInput(theme),
    select: sharedSelect(theme),
    shadow: sharedShadow,
  }
}

export {
  shared,
  defaultButton,
  sharedButton,
  sharedInput,
  sharedInputInline,
  sharedSelect,
  sharedSelectInline,
  sharedShadow,
}