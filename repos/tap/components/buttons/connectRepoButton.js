import React, { useCallback, useMemo } from 'react'
import { Values } from 'HKConstants'
import { Exchange } from 'HKAssets/icons/exchange'
import { HerkinButton } from './button.restyle'
import { useSelector } from 'HKHooks/useSelector'
import { checkCall, isEmptyColl } from '@keg-hub/jsutils'
import { connectRepo } from 'HKActions/repo/api/connect'

const { STORAGE } = Values

export const ConnectRepoButton = props => {
  const {
    children,
    disabled,
    styles,
    onConnecting,
    onError,
    branch,
    repoUrl,
    onConnect: onConnectCb,
  } = props

  const { user, repo } = useSelector(STORAGE.USER, STORAGE.REPO)

  const disabledBtn = useMemo(
    // If repo is not empty, then force disable the button
    () => (!isEmptyColl(repo) ? true : disabled),
    [repo, disabled]
  )

  const onConnect = useCallback(async () => {
    // TODO: add repoUrl validation
    if (!branch || !repoUrl)
      return checkCall(
        onError,
        new Error(`Missing repo branch or url`),
        branch,
        repoUrl
      )

    checkCall(onConnecting, true)
    // TODO: update the action to pull the user instead of doing it here
    const resp = await connectRepo({
      branch,
      repoUrl,
      username: user.username,
    })

    checkCall(onConnecting, false)

    return resp
      ? checkCall(onConnectCb, resp)
      : checkCall(
          onError,
          new Error(`Failed to mount repo. Please try again later`),
          resp
        )
  }, [user, branch, repoUrl, onError, onConnectCb, onConnecting])

  return (
    <HerkinButton
      Icon={Exchange}
      type='primary'
      onClick={onConnect}
      classPrefix='connect'
      disabled={disabledBtn}
      styles={styles?.button}
      text={children || `Connect`}
    />
  )
}