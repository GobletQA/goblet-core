import React from 'react'
import { useTheme } from '@keg-hub/re-theme'
import {
  ReModalHeader,
  ReHeadCenter,
  ReHeadLeft,
  ReHeadRight,
  ReHeadText
} from './modal.restyle'

/**
 * Modal Header component for consistent header display
 * @param {Object} props
 * @returns
 */
export const ModalHeader = props => {
  const {
    actionsLeft,
    actionsRight,
    classPrefix,
    children,
    Icon,
    title
  } = props
  const theme = useTheme()

  return (
    <ReModalHeader
      LeftComponent={actionsLeft && (
        <ReHeadLeft className={`${classPrefix}-modal-header-left`}>
          {actionsLeft}
        </ReHeadLeft>
      )}
      CenterComponent={
        <ReHeadCenter className={`${classPrefix}-modal-header-center`} >
          <>
            {Icon && (
              <Icon
                color={theme.tapColors.textColorAlt}
                height={30}
                width={30}
              />
            )}
            {children ||
              (title && <ReHeadText ellipsis={true}>{title}</ReHeadText>)}
          </>
        </ReHeadCenter>
      }
      RightComponent={actionsRight && (
        <ReHeadRight className={`${classPrefix}-modal-header-right`}>
          {actionsRight}
        </ReHeadRight>
      )}
    />
  )
}
