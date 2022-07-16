import React from 'react'
import { Values } from 'HKConstants'
import { EmptyScreen } from './index'
import { Reports } from 'HKComponents/reports'
import { RsScreenMain } from './screens.restyle'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { AsideCmdOutput } from 'HKComponents/cmdOutput/asideCmdOutput'

const { SCREENS } = Values

/**
 * ReportsScreen Component - Shows test reports and testRun model outputs
 * @param {Object} props
 *
 */
const ReportsScreen = props => {
  const activeFile = useActiveFile(SCREENS.REPORTS)

  return !activeFile?.fileType ? (
    <EmptyScreen message={'No file selected!'} />
  ) : (
    <RsScreenMain className={`reports-screen`}>
      <Reports {...props} />
      <AsideCmdOutput activeFile={activeFile} />
    </RsScreenMain>
  )
}

export default ReportsScreen