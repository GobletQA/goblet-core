import React, { useEffect, lazy, Suspense } from 'react'
import { Modal } from '../modal'
import { Values } from 'HKConstants'
import { Git } from 'HKAssets/icons/git'
import { isEmptyColl } from '@keg-hub/jsutils'
import { ModalMessage } from '../modalMessage'
import { ReSignInMain } from '../modal.restyle'
import { useSelector } from 'HKHooks/useSelector'
import { Loading } from '@keg-hub/keg-components'
import { setActiveModal } from 'HKActions/modals/setActiveModal'
import { setModalVisibility } from 'HKActions/modals/setModalVisibility'
const LazySignIn = lazy(() => import('HKAdminComponents/signIn/signIn'))

const { STORAGE, MODAL_TYPES } = Values

/**
 * Modal component for creating new test files
 * @param {Object} props
 * @returns
 */
export const SignInModal = props => {
  const { title = `Provider Sign-In`, visible = false } = props
  const { user } = useSelector(STORAGE.USER)
  const { repo } = useSelector(STORAGE.REPO)

  useEffect(() => {
    if (!user || isEmptyColl(user)) return

    // Close the modal
    setModalVisibility(false)

    // If the repo is empty then,
    // open the load repo modal to allow connecting repo
    isEmptyColl(repo) && setActiveModal(MODAL_TYPES.CONNECT_REPO)
  }, [user, repo])

  return (
    <Modal
      Icon={Git}
      type='sign-in'
      title={title}
      footer={false}
      backdrop={false}
      visible={visible}
      classPrefix='modal-sign-in'
    >
      <ReSignInMain>
        <Suspense fallback={<Loading />} >
          <LazySignIn
            MessageComponent={ModalMessage}
          />
        </Suspense>
      </ReSignInMain>
    </Modal>
  )
}
