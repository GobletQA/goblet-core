import React, { useEffect, useState, useCallback } from 'react'
import { ReMessage } from './signIn.restyle'
import { GitUser } from 'HKAdminServices/gitUser'
import { OtherProviders } from '../otherProviders'
import { checkCall, isArr } from '@keg-hub/jsutils'
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

  const {authDisabled, onNoAuthConfig, MessageComponent} = props

  useEffect(() => authDisabled || !authConfig ? checkCall(onNoAuthConfig) : GitUser.loadUser())

  const [signingIn, setSigningIn] = useState(false)
  const [signInError, setSignInError] = useState()

  const onFailedSignIn = useCallback(err => {
    setSigningIn(false)
    setSignInError(err.message)
    onFailedAuth(err)
  }, [])

  // Only show the auth buttons when they are enabled
  // In local mode auth is disabled, so no need to show them
  return authDisabled || !authConfig || !isArr(authConfig?.signInOptions)
    ? null
    : (
      <>
        <ReMessage>
          {MessageComponent && (
            <MessageComponent
              error={signInError}
              loading={signingIn && 'Signing in ...'}
            />
          )}
        </ReMessage>
        {/* TODO: update this when more providers are added */}
        {authConfig.signInOptions.map((option) => 
          <SignInButton
            auth={auth}
            Icon={GithubIcn}
            provider={option}
            prefix='keg-github'
            disabled={signingIn}
            onFail={onFailedSignIn}
            onSigningIn={setSigningIn}
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