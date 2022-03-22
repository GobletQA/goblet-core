import { getStore } from 'HKStore'
import { loadApiFile } from 'HKUtils/api'
import { addToast } from '../../toasts/addToast'
import { setReportsScreen } from '../../screens/setReportsScreen'

/**
 * Uses the passed in reportFile to set the activeFile for the reports screen
 * Then sets the reports screen active, so it can load the latest test file
 * @param {string} reportFile - Path the to html test reports file
 *
 * @returns {void}
 */
export const setReportActive = async reportFile => {
  if (!reportFile)
    return addToast({
      type: `error`,
      message: `Can not set report active. A location is required!`,
    })

  const { items } = getStore()?.getState()
  if (!items) return

  // Try to load the report file model
  const resp = await loadApiFile(reportFile)

  const file = resp?.data?.file
  file && setReportsScreen(file)

}
