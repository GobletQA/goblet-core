import { useCallback } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import { noOpObj, noOp } from '@keg-hub/jsutils'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { startBrowserRecorder } from 'HKActions/screencast/socket/startBrowserRecorder'

const { STORAGE } = Values

/**
 * Hook to run the tests of the active file by calling the runTests action
 * @param {Object} props
 *
 * @returns {function} - Callback to call when running tests on the active file
 */
export const useRecordAction = props => {
  const {
    onRecord = noOp,
    activeFile: propsActiveFile,
  } = props

  const activeFile = useActiveFile()
  const { repo } = useSelector(STORAGE.REPO)
  const testFile = propsActiveFile || activeFile || noOpObj
  // TODO: @lance-tipton - Set line where recording should start
  // Allow the user to click a location / line on the Recorder panel to set a marker
  // Store this line, which will be the line where the recording stops
  const recordLine = 20

  return useCallback(
    async event => {
      const appUrl = repo?.world?.url || repo?.world?.app?.url
      const options = {
        ref: 'page',
        action:{
          action: 'record',
          props: [{ line: recordLine }, appUrl],
        }
      }

      startBrowserRecorder(options)
    },
    [onRecord, testFile, repo]
  )
}
