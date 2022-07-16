import React, { useCallback } from 'react'
import { noOpObj, checkCall } from '@keg-hub/jsutils'
import { ModalHeader } from './modalHeader'
import { ModalFooter } from './modalFooter'
import { ReModal, ReForm } from './modal.restyle'
import { useCloseModal } from 'HKHooks/modal/useCloseModal'
import { useActiveScreenTab } from 'HKHooks/useActiveScreenTab'

export const Modal = props => {
  const {
    Icon,
    text,
    type,
    title,
    visible,
    children,
    footerLeft,
    footerRight,
    headerLeft,
    headerRight,
    main = noOpObj,
    backdrop = true,
    footer = noOpObj,
    header = noOpObj,
    content = noOpObj,
    onBackdropTouch,
    classPrefix = type,
  } = props

  const activeTab = useActiveScreenTab()
  const backdropClose = useCloseModal(activeTab?.id)
  const clickBackdrop = useCallback(() => {
    checkCall(onBackdropTouch)
    backdrop && backdropClose()
  }, [backdrop, onBackdropTouch, backdropClose])

  return (
    <ReModal
      visible={visible}
      classPrefix={classPrefix}
      className='goblet-modal-main'
      onBackdropTouch={clickBackdrop}
      {...main}
    >
      {header && (
        <ModalHeader
          Icon={Icon}
          title={title}
          actionsLeft={headerLeft}
          classPrefix={classPrefix}
          actionsRight={headerRight}
          className='goblet-modal-header'
          {...header}
        />
      )}
      {(children || text || footer) && (
        <ReForm
          classPrefix={classPrefix}
          className='goblet-modal-form'
          {...content}
        >
          {children || text}
          {footer && (
            <ModalFooter
              actionsLeft={footerLeft}
              classPrefix={classPrefix}
              actionsRight={footerRight}
              className='goblet-modal-footer'
              {...footer}
            />
          )}
        </ReForm>
      )}
    </ReModal>
  )
}
