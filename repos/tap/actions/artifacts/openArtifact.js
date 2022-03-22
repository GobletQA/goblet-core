import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'HKActions/toasts'

/**
 * Action to open an artifact in a new browser window tab
 * Based on the mime type, it will allow downloading the file, or displaying in the browser
 */
export const openArtifact = (node = noOpObj) => {
  const url = node?.name && `${window.location.origin}/artifacts/${node.name}`

  url
    ? window.open(url, '_blank').focus()
    : addToast({
        type: 'error',
        message: `Can not open artifact. An artifact name is required`,
      })
}
