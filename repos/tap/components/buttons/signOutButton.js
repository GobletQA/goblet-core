import React from 'react'

import { SignOut } from 'HKAssets/icons/signOut'
import { HerkinButton } from './button.restyle'
import { gitAuthSignOut } from 'HKActions/admin'
import { useDisconnectRepo } from 'HKHooks/repo/useDisconnectRepo'

/**
 * SignOutButton - Component to log a signed in user out
 * @param {Object} props
 *
 */
export const SignOutButton = props => {
  const { children, text = 'SignOut', ...args } = props

  const onClick = useDisconnectRepo(gitAuthSignOut)

  return (
    <HerkinButton
      type='danger'
      Icon={SignOut}
      classPrefix='sign-out'
      {...args}
      onClick={onClick}
    >
      {children || text}
    </HerkinButton>
  )
}
