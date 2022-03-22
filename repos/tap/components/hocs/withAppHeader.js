import React, { useCallback } from 'react'
import { Values } from 'HKConstants'
import { Cog } from 'HKAssets/icons/cog'
import { useStyle } from '@keg-hub/re-theme'
import { SignOut } from 'HKAssets/icons/signOut'
import { gitAuthSignOut } from 'HKActions/admin'
import { setActiveModal } from 'HKActions/modals'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { isAuthActive } from 'HKUtils/isAuthActive'
import { AppHeader, View, H5 } from '@keg-hub/keg-components'
import { useDisconnectRepo } from 'HKHooks/repo/useDisconnectRepo'
import { CondensedButton } from 'HKComponents/buttons/condensedButton'


const { MODAL_TYPES } = Values

const authActive = isAuthActive()
const ReRightMain = reStyle(View)(theme => ({
  d: 'flex',
  fl: 1,
  flD: 'row',
  jtC: 'end',
}))

const HeaderRight = props => {
  const onClickSettings = useCallback(async () => {
    setActiveModal(MODAL_TYPES.TEST_SELECTOR)
  }, [])

  const onClickSignOut = useDisconnectRepo(gitAuthSignOut)

  return (
    <ReRightMain>
      <CondensedButton
        Icon={Cog}
        text={'Settings'}
        classPrefix={'settings'}
        onClick={onClickSettings}
        styles={props.styles?.right}
      />
      {authActive && (
        <CondensedButton
          Icon={SignOut}
          text={'SignOut'}
          classPrefix={'sign-out'}
          onClick={onClickSignOut}
          styles={props.styles?.right}
        />
      )}
    </ReRightMain>
  )
}

/**
 * Wraps the component with AppHeader
 *
 * @param {Object} title - title on the app header
 * @param {Object} Component - React component to be wrapped
 *
 * @returns {function} - wrapped functional component
 */
export const withAppHeader = (title, Component) => {
  const AppHeaderHoc = props => {
    const styles = useStyle('appHeader', props.styles)
    return (
      <>
        <AppHeader
          styles={styles.main}
          LeftComponent={
            <View className='header-left-component' style={styles.left.main}>
              <H5
                className='header-left-title'
                style={styles.left.content.title}
              >
                {title}
              </H5>
            </View>
          }
          RightComponent={<HeaderRight styles={styles} />}
        />
        <Component {...props} />
      </>
    )
  }

  return AppHeaderHoc
}
