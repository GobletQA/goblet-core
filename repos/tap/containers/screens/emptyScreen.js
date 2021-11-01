import React from 'react'
import { Values } from 'SVConstants'
import { useTheme } from '@keg-hub/re-theme'
import { Row, Section, H6 } from 'SVComponents'

const { SCREENS } = Values

export const EmptyScreen = props => {
  const theme = useTheme()
  const screenStyles = theme?.screens?.empty || {}

  return props?.message || props?.children
  ? (
      <Section className='screen-empty' style={screenStyles.main} >
        <Row>
          { props.children || (
            <H6 className='screen-empty-message' style={screenStyles.message} >
              { props.message }
            </H6>
          )}
        </Row>
      </Section>
    )
  : null
}

EmptyScreen.tabId = SCREENS.EMPTY