import React from 'react'
import { Loading as KegLoading } from '@keg-hub/keg-components'
import { ReLoading } from './signIn.restyle'

export const Loading = props => {
  return (
    <ReLoading>
      <KegLoading />
    </ReLoading>
  )
}
