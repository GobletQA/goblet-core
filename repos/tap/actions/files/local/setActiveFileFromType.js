import { Values } from 'HKConstants'
import { setActiveFile } from './setActiveFile'
import { addToast } from '../../toasts/addToast'
import { setReportsScreen } from '../../screens/setReportsScreen'

/**
 * Calls the activeFile method for the fileModel based on the file type
 * @param {Object} fileModel - File model object to set active
 * @param {string} screenId - Id of the screen to set the fileModel as the activeFile
 *
 * @returns {void}
 */
export const setActiveFileFromType = (fileModel, screenId) => {
  const { FILE_TYPES } = Values

  switch (fileModel.fileType) {
    case FILE_TYPES.REPORT:
      return setReportsScreen(fileModel)
    case FILE_TYPES.FEATURE:
      return setActiveFile(fileModel, screenId, true)
    case FILE_TYPES.UNIT:
    case FILE_TYPES.WAYPOINT:
    case FILE_TYPES.DEFINITION:
    case FILE_TYPES.SUPPORT:
      // Eventually we want to support other file type clasifications
      // This includes general support, html and markdown class types
      // case FILE_TYPES.HTML:
      // case FILE_TYPES.DOCS:
      return setActiveFile(fileModel, screenId, false)
    default:
      return addToast({
        type: `error`,
        message: `Could not ${fileModel.name} active. Unknown file type ${fileModel.fileType}`,
      })
  }
}
