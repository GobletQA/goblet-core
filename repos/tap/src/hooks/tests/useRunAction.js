import { useCallback, useMemo } from 'react'
import { Values } from 'HKConstants'
import { useSockr } from '@ltipton/sockr'
import { runTests } from 'HKActions/runner/runTests'
import { addToast } from 'HKActions/toasts/addToast'
import { noOpObj, get, noOp } from '@keg-hub/jsutils'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { usePendingCheck } from 'HKHooks/activeFile/usePendingCheck'
import { savePendingContent } from 'HKActions/files/local/savePendingContent'

const { SCREENS, RUN_ALL_TESTS } = Values

/**
 * Hook to memoize the command to run through sockr
 * @param {Object} commands - Commands loaded from the backend
 * @param {string} cmdName - Name of the command to get
 *
 * @returns {Object} - Found command object from the cmdName prop
 */
const useTestCommand = (commands, cmdName) =>
  useMemo(() => get(commands, ['tests', cmdName]), [commands, cmdName])

/**
 * Hook to run the tests of the active file by calling the runTests action
 * @param {Object} props
 *
 * @returns {function} - Callback to call when running tests on the active file
 */
export const useRunAction = props => {
  const {
    onRun = noOp,
    autoChangeScreen,
    runAllTests = false,
    checkPending = true,
    activeFile: propsActiveFile,
  } = props

  const activeFile = useActiveFile()
  const testFile = propsActiveFile || activeFile || noOpObj

  const { commands = noOpObj } = useSockr()
  const pendingContent = usePendingCheck(checkPending, testFile.uuid)
  const testCommand = useTestCommand(commands, testFile.fileType)

  return useCallback(
    async event => {
      // Call the passed in onRun callback
      // If it returns false, then don't do anything else in this callback
      const shouldContinue = await onRun(
        event,
        testFile,
        testCommand,
        pendingContent,
        runAllTests
      )

      if (shouldContinue === false) return

      if (!testCommand)
        return addToast({
          type: 'danger',
          message: `Can not run tests for this file. It is not a test file!`,
        })

      // Save the file first if it has pending changes
      const canRun = pendingContent
        ? await savePendingContent(pendingContent, testFile, false)
        : true

      canRun
        ? runAllTests
          ? runTests(
              RUN_ALL_TESTS,
              testCommand,
              SCREENS.EDITOR,
              autoChangeScreen
            )
          : runTests(testFile, testCommand, SCREENS.EDITOR, autoChangeScreen)
        : addToast({
            type: 'danger',
            message: `Can not run test on a file with pending changes!\n The file must be saved first!`,
          })
    },
    [onRun, testFile, pendingContent, runAllTests, testCommand, autoChangeScreen]
  )
}
