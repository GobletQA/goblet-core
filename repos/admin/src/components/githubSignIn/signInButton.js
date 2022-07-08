import React, {useCallback, useState} from 'react'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { useIconProps } from 'HKHooks/useIconProps'
import { View, Button, Text } from '@keg-hub/keg-components'

const defPrefix = 'goblet-github-button'
const defClasses = {
  main: 'main',
  button: 'button',
  content: 'content',
  text: 'text',
  icon: 'icon',
}

export const SignInButton = reStyle((props) => {
  const {
    children,
    Icon,
    text,
    auth,
    styles,
    onFail,
    provider,
    onSuccess,
    onSigningIn,
    prefix=defPrefix,
    classes=defClasses,
    ...btnProps
  } = props
  const iconProps = useIconProps(props, styles?.icon)

  const onBtnPress = useCallback(async evt => {
    onSigningIn(true)

    signInWithPopup(auth, provider)
      .then(result => {
        const credential = GithubAuthProvider.credentialFromResult(result)
        const user = result.user
        const additionalUserInfo = result._tokenResponse
        try {
          additionalUserInfo.profile = JSON.parse(additionalUserInfo.rawUserInfo)
        }
        catch(err){
          console.err(err.message)
          throw new Error(`Could not parse GitHub User profile information`)
        }
        onSuccess?.({
          user,
          credential,
          additionalUserInfo
        })
      })
      .catch(err => onFail?.(err))

  }, [auth, provider, onSuccess, onFail])
  
  return (
    <View
      style={styles?.main}
      className={`${prefix}-${classes?.main}`}
    >
      <Button
        {...btnProps}
        onClick={onBtnPress}
        className={`${prefix}-${classes?.button}`}
        styles={styles.button}
      >
        {Icon && (
          <Icon
            className={`${prefix}-${classes?.icon}`}
            {...iconProps}
          />
        )}
        {(children || text) && (
          <Text
            style={styles?.text}
            className={`${prefix}-${classes?.text}`}
          >
            {children || text}
          </Text>
        )}
      </Button>
    </View>
  )
}, 'styles')(theme => ({
  main: {
    flD: 'column',
    alI: 'center',
    jtC: 'center',
    mB: theme.margin.size,
  },
  button: {
    default: {
      main: {
        maxW: 220,
        flD: 'row',
        alI: 'center',
        jtC: 'center',
        pH: theme.padding.size,
        pV: (theme.padding.size / 3) * 2,
        backgroundColor: '#333333',
      },
    },
    hover: {
      main: {
        backgroundColor: '#555555',
      },
    },
  },
  icon: {
    mR: 10,
    fontSize: 20,
    color: theme.colors.palette.white01,
  },
  text: {
    fontSize: 14,
    color: theme.colors.palette.white01,
  },
}))
