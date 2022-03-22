import React from 'react'
import { Values } from 'HKConstants'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { SignInModal } from './content/signIn'
import { ConnectRepoModal } from './content/connectRepo'
import { FileSelectorModal } from './content/fileSelector'
import { NoLocalMountModal } from './content/noLocalMount'
import { ConfirmRemoveFile } from './content/confirmRemoveFile'


const { CATEGORIES, MODAL_TYPES } = Values

/**
 * Manages which modal to display
 * @returns {null|Component}
 */
export const ModalManager = () => {
  const { activeModal, visible, props } = useStoreItems(CATEGORIES.MODALS) || {}

  switch (activeModal) {
    case MODAL_TYPES.TEST_SELECTOR:
      return <FileSelectorModal visible={visible} />
    case MODAL_TYPES.CONNECT_REPO:
      return <ConnectRepoModal visible={visible} />
    case MODAL_TYPES.NO_LOCAL_MOUNT:
      return <NoLocalMountModal visible={visible} />
    case MODAL_TYPES.SIGN_IN:
      return <SignInModal visible={visible} />
    case MODAL_TYPES.CONFIRM_REMOVE_FILE:
      return <ConfirmRemoveFile visible={visible} {...props} />
    default:
      return null
  }
}
