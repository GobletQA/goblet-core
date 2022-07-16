export const transition = theme => {
  Object.assign(theme.transition, {
    height: {
      overflow: 'hidden',
      // transition: 'max-height 1s ease',
    },
    rotate: {
      default: { transition: 'transform 1s ease' },
      180: { transform: 'rotate(180deg)' },
    },
  })

  return theme.transition
}
