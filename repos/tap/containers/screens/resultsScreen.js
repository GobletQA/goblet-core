import { noOp } from '@keg-hub/jsutils'
import { getBaseApiUrl } from 'SVUtils/api'
import { EmptyScreen } from './emptyScreen'
import { Iframe } from 'SVComponents/iframe'
import { useStyle } from '@keg-hub/re-theme'
import { ExternalLink } from 'SVAssets/icons'
import { Surface } from 'SVComponents/surface'
import { apiRequest } from 'SVUtils/api/apiRequest'
import { useActiveTestFile } from 'SVHooks/useActiveTestFile'
import React, { useEffect, useState, useMemo } from 'react'
import { View, TouchableIcon } from '@keg-hub/keg-components'
import { PrefixTitleHeader } from 'SVComponents/labels/prefixTitleHeader'

const useReportsUrl = fileType => useMemo(() => {
  return `${getBaseApiUrl()}/reports/${fileType || 'list'}`
}, [getBaseApiUrl, fileType])

const useWindowOpen = (fileType, reportUrl) => useMemo(() => {
  return fileType ? () => window?.open(reportUrl, '_blank') : noOp
}, [fileType, reportUrl])

export const ResultsScreen = props => {
  const builtStyles = useStyle(`screens.results`)
  const activeFile = useActiveTestFile(props.id)

  const { fileType } = activeFile
  const reportUrl = useReportsUrl(fileType)
  const onIconPress = useWindowOpen(fileType, reportUrl)

  return !activeFile?.fileType
    ? (<EmptyScreen message={'No file selected!'} />)
    : (<View
        className={`results-screen`}
        style={builtStyles.main}
      >
        <Surface
          prefix={'Test Results'}
          TitleComponent={({styles, ...props}) => 
            <IframeHeader
              {...props}
              onIconPress={onIconPress}
              mainTextStyles={styles}
              mainStyles={builtStyles?.iFrame?.header} 
            />
          }
          capitalize={false}
          title={'Report'}
          styles={builtStyles?.iFrame?.surface}
          className={`runner-surface-iframe`}
        >
          <Iframe src={reportUrl}/>
        </Surface>
      </View>
  )
}



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
const IframeHeader = (props) => {
  const {
    mainTextStyles,
    prefix,
    title,
    titleStyle,
    capitalize,
    mainStyles,
    onIconPress
  } = props

  return (
    <View style={mainStyles?.main}>
      <PrefixTitleHeader
        styles={mainTextStyles}
        titleStyle={titleStyle}
        title={title}
        prefix={prefix}
        capitalize={capitalize}
      />
      <TouchableIcon
        styles={mainStyles?.icon}
        color={mainStyles?.icon?.color}
        size={mainStyles?.icon?.size}
        onPress={onIconPress}
        Component={ ExternalLink }
      />
    </View>
  )
}