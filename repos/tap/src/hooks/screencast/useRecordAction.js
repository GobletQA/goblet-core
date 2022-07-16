import { useCallback, useState, useEffect } from 'react'
import { Values } from 'HKConstants'
import { useSelector } from 'HKHooks/useSelector'
import { noOp, checkCall } from '@keg-hub/jsutils'
import { getWorldVal } from 'HKUtils/repo/getWorldVal'
import { setRecorderStatus } from 'HKActions/screencast/socket/setRecorderStatus'

const { CATEGORIES, RECORD_ACTIONS } = Values

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

  const [loading, setLoading] = useState(false)
  const { recordingBrowser } = useSelector(CATEGORIES.RECORDING_BROWSER)

  const { isRecording } = recordingBrowser
  const appUrl = getWorldVal(`url`, `app.url`)

  // TODO: @lance-tipton - Set line where recording should start
  // Allow the user to click a location / line on the Recorder panel to set a marker
  // Store this line, which will be the line where the recording stops
  const recordLine = 20

  const onClick = useCallback(
    async event => {
      const options = {
        ref: 'page',
        action: isRecording
          ? { props: [], action: RECORD_ACTIONS.STOP }
          : { props: [{}, appUrl], action: RECORD_ACTIONS.START }
      }

      setLoading(true)
      setRecorderStatus(options)
      checkCall(onRecord, options)
    },
    [isRecording, appUrl, onRecord]
  )

  useEffect(() => {
    isRecording && loading && setLoading(false)
  }, [isRecording, loading])

  return {
    loading,
    onClick,
    setLoading,
    isRecording
  }
  
}
