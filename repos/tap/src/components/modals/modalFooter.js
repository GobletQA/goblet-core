import React from 'react'
import {
  ReFooterMain,
  ReFooterLeft,
  ReFooterRight,
  ReFooterCenter,
} from './modal.restyle'

export const ModalFooter = props => {
  const { children, actionsLeft, actionsRight, classPrefix = 'goblet' } = props

  return (
    <ReFooterMain className={`${classPrefix}-modal-footer-main`}>
      {actionsLeft && (
        <ReFooterLeft className={`${classPrefix}-modal-footer-left`}>
          {actionsLeft}
        </ReFooterLeft>
      )}
      {children && (
        <ReFooterCenter className={`${classPrefix}-modal-footer-center`}>
          {children}
        </ReFooterCenter>
      )}
      {actionsRight && (
        <ReFooterRight className={`${classPrefix}-modal-footer-right`}>
          {actionsRight}
        </ReFooterRight>
      )}
    </ReFooterMain>
  )
}
