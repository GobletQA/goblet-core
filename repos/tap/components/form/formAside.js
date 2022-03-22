import React from 'react'
import { useTheme } from '@keg-hub/re-theme'
import { RePreside, RePostside } from './form.restyle'

export const FormAside = props => {
  const {
    Wrapper,
    pre,
    post,
    type,
    Aside,
    height=15,
    width=15,
    ...asideProps
  } = props
  const theme = useTheme()

  if(!Aside) return null

  const Main = Wrapper
    ? Wrapper
    : post || type === 'post'
      ? RePostside
      : RePreside

  return (
    <Main>
      <Aside
        {...asideProps}
        color={theme?.tapColors?.textColor}
        width={width}
        height={height}
      />
    </Main>
  )
}