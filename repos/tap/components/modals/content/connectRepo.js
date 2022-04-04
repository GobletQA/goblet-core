import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { Modal } from '../modal'
import { Values } from 'HKConstants'
import { Git } from 'HKAssets/icons/git'
import { Sync } from 'HKAssets/icons/sync'
import { Link } from 'HKAssets/icons/link'
import { useTheme } from '@keg-hub/re-theme'
import { Branch } from 'HKAssets/icons/branch'
import { ModalMessage } from '../modalMessage'
import { noPropArr, isUrl } from '@keg-hub/jsutils'
import { getRepos } from 'HKActions/repo/api/getRepos'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { setScreenById } from 'HKActions/screens/setScreenById'
import { setActiveModal } from 'HKActions/modals/setActiveModal'
import { SignOutButton } from 'HKComponents/buttons/signOutButton'
import { ControlledAuto } from 'HKComponents/form/controlledAuto'
import { CondensedButton } from 'HKComponents/buttons/condensedButton'
import { setModalVisibility } from 'HKActions/modals/setModalVisibility'
import { ConnectRepoButton } from 'HKComponents/buttons/connectRepoButton'

const {
  SCREENS,
  STORAGE,
  CATEGORIES,
  MODAL_TYPES
} = Values

/**
 * Memoized callback method called when the connect repo button is pressed
 */
 const useOnLoadRepo = (connectError, repoUrl, branch, setRepoUrl, setBranch, user) => {
  return useCallback(
    async resp => {
      if (!resp)
        return setConnectError(`Failed to mount repo. Please try again later.`)

      //Reset test name so that previously entered name does not remain in the name field
      setRepoUrl('')
      setBranch('')

      // Update the screen to be the editor
      setScreenById(SCREENS.EDITOR)

      // Close the modal
      setModalVisibility(false)

      // Open the selector modal to allow selecting a file from the mounted repo
      setActiveModal(MODAL_TYPES.TEST_SELECTOR)
    },
    [
      user,
      branch,
      repoUrl,
      setBranch,
      setRepoUrl,
      connectError,
    ]
  )
}


const useRepoBranches = (repoUrl, repos) => {
  return useMemo(() => {
    return repos &&
      repos.reduce((acc, repo) => {
        return repo.url === repoUrl ? repo.branches : acc
      }, noPropArr)
  }, [repoUrl, repos])
}

const useSelectItem = (item, setItem) => {
  return useCallback(update => {
    update.text !== item && setItem(update.text)
  }, [item, setItem])
}

/**
 * Button to sync repos from the current auth provider
 */
const SyncRepos = props => {
  const theme = useTheme()
  const styles = useMemo(() => {
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
  }, [theme])

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

/**
 * Modal component for creating new test files
 * @param {Object} props
 * @returns
 */
export const ConnectRepoModal = props => {
  const { title = 'Connect Repo', visible = false } = props
  const { user, providerRepos } = useStoreItems([
    STORAGE.USER,
    CATEGORIES.PROVIDER_REPOS,
  ])

  // On initial load of the component, load the users repos
  useEffect(() => ((!providerRepos || !providerRepos.length) && getRepos()), [])
  
  const [branch, setBranch] = useState('')
  const [connectError, setConnectError] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const onRepoSelect = useSelectItem(repoUrl, setRepoUrl)
  const onBranchSelect = useSelectItem(branch, setBranch)

  const onConnecting = useCallback(connecting => {
    setIsConnecting(connecting)
    setConnectError(false)
  })

  const onError = useCallback(error => {
    setIsConnecting(false)
    error && setConnectError(error.message)
  })

  const repos = useMemo(() => {
    return providerRepos.map(repo => repo.url)
  }, [providerRepos])

  const branches = useRepoBranches(repoUrl, providerRepos)

  const onLoadRepo = useOnLoadRepo(
    connectError,
    repoUrl,
    branch,
    setRepoUrl,
    setBranch,
    user
  )

  const disabled = useMemo(() => {
    return !Boolean(branch && isUrl(repoUrl) && !isConnecting)
  }, [repoUrl, branch, isConnecting])
  
  return (
    <Modal
      Icon={Git}
      title={title}
      type='loadRepo'
      backdrop={false}
      visible={visible}
      classPrefix='modal-load-repo'
      headerRight={(<SyncRepos />)}
      footerLeft={(<SignOutButton disabled={isConnecting} />)}
      footerRight={(
        <ConnectRepoButton
          repoUrl={repoUrl}
          branch={branch}
          onError={onError}
          onConnect={onLoadRepo}
          disabled={disabled}
          onConnecting={onConnecting}
        />
      )}
    >
      <ModalMessage
        error={connectError}
        loading={isConnecting && 'Connecting Repo ...'}
      />
      <ControlledAuto
        zIndex={2}
        Aside={Link}
        text={repoUrl}
        values={repos}
        required={true}
        title={'Repo URL'}
        onChange={setRepoUrl}
        emptyShowList={true}
        disabled={isConnecting}
        onSelect={onRepoSelect}
        className={'modal-repo-url-field'}
        placeholder='https://github.com/organization/repo-name'
      />
      <ControlledAuto
        zIndex={1}
        Aside={Branch}
        text={branch}
        required={true}
        values={branches}
        title={'Branch'}
        placeholder='main'
        onChange={setBranch}
        emptyShowList={true}
        disabled={isConnecting}
        onSelect={onBranchSelect}
        className={'modal-repo-branch-field'}
      />
    </Modal>
  )
}