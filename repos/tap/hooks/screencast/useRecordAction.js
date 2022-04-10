import { useCallback } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import { noOpObj, noOp, checkCall } from '@keg-hub/jsutils'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { setRecorderStatus } from 'HKActions/screencast/socket/setRecorderStatus'

const { CATEGORIES, STORAGE, RECORD_ACTIONS } = Values

/**
 * Hook to run the tests of the active file by calling the runTests action
 * @param {Object} props
 *
 * @returns {function} - Callback to call when running tests on the active file
 */
export const useRecordAction = props => {
  const {
    onRecord = noOp,
  } = props

  const { repo, recordingBrowser } = useSelector(STORAGE.REPO, CATEGORIES.RECORDING_BROWSER)
  const { isRecording } = recordingBrowser
  const appUrl = repo?.world?.url || repo?.world?.app?.url

  // TODO: @lance-tipton - Set line where recording should start
  // Allow the user to click a location / line on the Recorder panel to set a marker
  // Store this line, which will be the line where the recording stops
  const recordLine = 20

  return useCallback(
    async event => {
      const options = {
        ref: 'page',
        action: isRecording
          ? { props: [], action: RECORD_ACTIONS.STOP }
          : { props: [{}, appUrl], action: RECORD_ACTIONS.START }
      }

      setRecorderStatus(options)
      checkCall(onRecord, options)
    },
    [isRecording, appUrl, onRecord]
  )
}
