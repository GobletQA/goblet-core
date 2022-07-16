import React from 'react'
import { Sync } from 'HKAssets/icons/sync'
import { useStylesCallback } from '@keg-hub/re-theme'
import { getRepos } from 'HKActions/repo/api/getRepos'
import { CondensedButton } from 'HKComponents/buttons/condensedButton'


const buildStyle = (theme) => {
  return {
    default: {
      main: {},
      touch: {
        opacity: 0.4,
        ...theme.transition(['opacity'], 0.8),
      },
      container: {
        alignItems: 'center',
      },
      icon: {
        fontSize: 15,
        color: theme.tapColors.white,
        marginBottom: 3,
      },
      text: {
        fontSize: 8,
        color: theme.tapColors.white,
      },
    },
    hover: {
      touch: {
        opacity: 1,
      },
    },
  }
}

/**
 * Button to sync repos from the current auth provider
 */
export const SyncReposButton = props => {
  const styles = useStylesCallback(buildStyle)

  return (
    <CondensedButton
      Icon={Sync}
      text={'Sync Repos'}
      classPrefix={'sync'}
      onClick={getRepos}
      styles={styles}
    />
  )
}
