import React from 'react'
import { NoActiveMain, NoActiveText } from './definition.restyle'

/**
 * NoActiveDefinition - Displays when no definition is active
 * @param {Object} props
 * @param {Object} props.styles - Custom styles for displaying the component
 *
 * @returns {Component}
 */
export const NoActiveDefinition = props => {
  return (
    <NoActiveMain className={'empty-definitions-main'}>
      <NoActiveText className={'empty-definitions-text'}>
        No Active Definition
      </NoActiveText>
    </NoActiveMain>
  )
}
