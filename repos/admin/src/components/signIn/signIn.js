import React, { useEffect, useMemo, useCallback } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { GitUser } from 'HKAdminServices/gitUser'
import { checkCall, noOp, isArr } from '@keg-hub/jsutils'
import { OtherProviders } from '../otherProviders'
import { GithubIcn } from '../githubSignIn/githubIcn'
import { SignInButton } from '../githubSignIn/signInButton'
import { getProviderMetadata } from 'HKAdminServices/providers'
import { onSuccessAuth, onFailedAuth } from 'HKAdminActions/provider'
const { auth, config } = getProviderMetadata()

/**
 * Remove the signInSuccessUrl property to allow sign in to be handled by the callbacks
 */
const authConfig = config && config.ui

const SignIn = props => {

  const {authDisabled, onNoAuthConfig } = props

  useEffect(() => authDisabled || !authConfig ? checkCall(onNoAuthConfig) : GitUser.loadUser())

  // Only show the auth buttons when they are enabled
  // In local mode auth is disabled, so no need to show them
  return authDisabled || !authConfig || !isArr(authConfig?.signInOptions)
    ? null
    : (
      <>
        {/* TODO: update this when more providers are added */}
        {authConfig.signInOptions.map((option) => 
          <SignInButton
            auth={auth}
            disabled={false}
            Icon={GithubIcn}
            provider={option}
            prefix='keg-github'
            onFail={onFailedAuth}
            onSuccess={onSuccessAuth}
            key={option.providerId}
            children='Sign in with GitHub'
          />
        )}
        <OtherProviders />
      </>
    )
}

export default SignIn