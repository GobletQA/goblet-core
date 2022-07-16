import React from 'react'
import { ExternalLink } from 'HKAssets/icons/externalLink'
import { PrefixTitleHeader } from 'HKComponents/labels/prefixTitleHeader'
import { ReIframeHeaderMain, ReIframeHeaderIcon } from './iframe.restyle'

/**
 * IframeHeader
 * @param {Object} props
 * @param {Object} props.mainTextStyles - passed down from surface component
 * @param {string} props.prefix - prefix passed in to the Surface
 * @param {string} props.title - title passed in to Surface
 * @param {Object} props.titleStyle - titleStyle passed in to Surface
 * @param {Boolean} props.capitalize - capitalize value passed in to Surface
 *
 * @returns {Component}
 */
export const IframeHeader = props => {
  const {
    mainTextStyles,
    prefix,
    title,
    titleStyle,
    capitalize,
    onExternalOpen,
  } = props

  return (
    <ReIframeHeaderMain
      className={'iframe-header-main'}
      onPress={onExternalOpen}
    >
      <PrefixTitleHeader
        title={title}
        prefix={prefix}
        styles={mainTextStyles}
        titleStyle={titleStyle}
        capitalize={capitalize}
      />
      <ReIframeHeaderIcon
        Icon={ExternalLink}
        className={'iframe-header-icon'}
      />
    </ReIframeHeaderMain>
  )
}
