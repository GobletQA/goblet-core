import React from 'react'
import { useTheme } from '@keg-hub/re-theme'
import { Row, Section, H6 } from '@keg-hub/keg-components'

export const EmptyScreen = props => {
  const theme = useTheme()
  const screenStyles = theme?.screens?.empty || {}

  return props?.message || props?.children ? (
    <Section className='screen-empty' style={screenStyles.main}>
      <Row>
        {props.children || (
          <H6 className='screen-empty-message' style={screenStyles.message}>
            {props.message}
          </H6>
        )}
      </Row>
    </Section>
  ) : null
}

export default EmptyScreen