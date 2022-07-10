import React, { useCallback, useMemo } from 'react'
import { Modal } from '../modal'
import { Values } from 'HKConstants'
import { addToast } from 'HKActions/toasts'
import { Times } from 'HKAssets/icons/times'
import { Trash } from 'HKAssets/icons/trash'
import { P, Text } from '@keg-hub/keg-components'
import { setActiveModal } from 'HKActions/modals'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { removeFile } from 'HKActions/files/api/removeFile'
import { GobletButton } from 'HKComponents/buttons/button.restyle'
import { ExclamationCircle } from 'HKAssets/icons/exclamationCircle'

const { MODAL_TYPES } = Values

const RePar = reStyle(P)(theme => ({
  p: theme.padding.size,
  textAlign: 'center'
}))

const ReHl = reStyle(Text)(theme => ({
  color: theme.tapColors.danger
}))

const ReUndone = reStyle(P)(theme => ({
  textAlign: 'center',
  pB: theme.padding.size / 2,
}))

export const ConfirmRemoveFile = props => {
  const {
    screenId,
    activeFile,
    visible=false,
    onFileRemoved,
    onRemovedCanceled,
    title=`Delete File`,
  } = props

  const onTouch = useCallback(async () => {
    if(!activeFile)
      return addToast({
        type: 'error',
        message: `Can not remove file because it can not be found!`,
      })

    const resp = await removeFile(activeFile, screenId)
    onFileRemoved?.(resp)
    // TODO: confirm this remove the modal props in the store
    setActiveModal(MODAL_TYPES.CONFIRM_REMOVE_FILE, false)
  }, [activeFile, screenId, onFileRemoved])

  const onCancel = useCallback(() => {
    onRemovedCanceled?.(resp)
    setActiveModal(MODAL_TYPES.CONFIRM_REMOVE_FILE, false)
  }, [onRemovedCanceled])

  return (
    <Modal
      type='remove'
      title={title}
      visible={visible}
      Icon={ExclamationCircle}
      classPrefix='modal-remove'
      footerLeft={(
        <GobletButton
          Icon={Times}
          text='Cancel'
          type='default'
          onPress={onCancel}
        />
      )}
      footerRight={(
        <GobletButton
          Icon={Trash}
          text='Confirm'
          type='danger'
          onPress={onTouch}
        />
      )}
    >
      <RePar>
        Are your sure your want to delete
        {activeFile?.name && (<ReHl> {activeFile?.relative || activeFile?.name}</ReHl>)}
      </RePar>
      <ReUndone>
        This action can not be undone.
      </ReUndone>
    </Modal>
  )
}
