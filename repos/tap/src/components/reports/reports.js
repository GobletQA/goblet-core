import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { noOp } from '@keg-hub/jsutils'
import { ReportsTabs } from './reportsTabs'
import { TestsRunning } from './testsRunning'
import { Surface } from 'HKComponents/surface'
import { SelectReport } from './selectReport'
import { ReReportsMain } from './reports.restyle'
import { Iframe } from 'HKComponents/iframe/iframe'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { IframeHeader } from 'HKComponents/iframe/iframeHeader'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { useActiveTestRuns } from 'HKHooks/activeFile/useActiveTestRuns'

const { SCREENS, CATEGORIES } = Values

import { getBaseApiUrl } from 'HKUtils/api'

/**
 * Callback hook to open the test report in a new window
 * @param {string} fileType - Active Test file type
 * @param {string} reportUrl - Url of the test report
 *
 * @return {void}
 */
const useWindowOpen = reportUrl =>
  useMemo(() => {
    return reportUrl ? () => window?.open(reportUrl, '_blank') : noOp
  }, [reportUrl])

/**
 * Gets the url of the test report to be loaded
 * @param {string} fileType - Active Test file type
 * @param {string} name - Name of the test file
 *
 * @return {string} - Built report url
 */
const useReportsUrl = (activeFile, repoName) => {
  return useMemo(() => {
    return (
      activeFile &&
      activeFile.fileType === Values.FILE_TYPES.REPORT &&
      `${getBaseApiUrl()}${activeFile?.ast?.reportUrl}`
    )
  }, [activeFile])
}

/**
 * Reports
 * @param {Object} props
 * @param {Object} props.reportUrl - Url of the report being viewed
 * @param {string} props.activeFile - Current activeFile for this screen
 * @param {string} props.onExternalOpen - callback called when the icon is pressed
 * @param {Object} props.styles - Custom styles for the Reports component
 *
 * @returns {Component}
 */
export const Reports = props => {
  const { repo } = useStoreItems([CATEGORIES.REPO])
  const activeFile = useActiveFile(SCREENS.REPORTS)
  const reportUrl = useReportsUrl(activeFile, repo?.name)
  const onExternalOpen = useWindowOpen(reportUrl)
  const testRunModel = useActiveTestRuns()

  return (
    <ReReportsMain>
      <Surface
        prefix={'Test Reports'}
        TitleComponent={({ styles: textStyles, ...props }) => (
          <IframeHeader
            {...props}
            onExternalOpen={onExternalOpen}
            mainTextStyles={textStyles}
          />
        )}
        capitalize={false}
        title={activeFile.name}
        className={`reports-surface-iframe`}
      >
        {testRunModel?.running ? (
          <TestsRunning />
        ) : reportUrl ? (
          <Iframe src={reportUrl} />
        ) : (
          <SelectReport />
        )}
      </Surface>
      <ReportsTabs />
    </ReReportsMain>
  )
}
