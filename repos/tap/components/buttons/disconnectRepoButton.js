import React, { useCallback, useMemo } from 'react'

import { Values } from 'HKConstants'
import { Times } from 'HKAssets/icons/times'
import { gitAuthSignOut } from 'HKActions/admin'
import { GobletButton } from './button.restyle'
import { useSelector } from 'HKHooks/useSelector'
import { isEmptyColl, checkCall } from '@keg-hub/jsutils'
import { useDisconnectRepo } from 'HKHooks/repo/useDisconnectRepo'

const { STORAGE } = Values

export const DisconnectRepoButton = props => {
  const {
    text,
    styles,
    children,
    disabled,
    signOutUser,
    onClick: onClickCb,
  } = props

  const { user } = useSelector(STORAGE.USER)
  const { repo } = useSelector(STORAGE.REPO)

  const disableBtn = useMemo(
    // If repo is empty or no user, then force disable the button
    () => (isEmptyColl(repo) || !user ? true : disabled),
    [repo, user, disabled]
  )

  const onDisconnect = useCallback(
    evt => {
      signOutUser && gitAuthSignOut()
      checkCall(onClickCb, evt)
    },
    [onClickCb, signOutUser]
  )

  const onClick = useDisconnectRepo(onDisconnect)

  return (
    <GobletButton
      Icon={Times}
      type='danger'
      styles={styles}
      onClick={onClick}
      disabled={disableBtn}
      classPrefix='disconnect'
      text={children || text || `Disconnect`}
    />
  )
}
