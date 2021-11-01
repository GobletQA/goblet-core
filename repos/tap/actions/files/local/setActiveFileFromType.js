import { Values } from 'SVConstants'
import { setActiveFile } from './setActiveFile'
import { addToast } from '../../toasts/addToast'
import { setAltActiveFile } from './setAltActiveFile'
const { FILE_TYPES } = Values

/**
 * Calls the activeFile method for the fileModel based on the file type
 * @param {Object} fileModel - File model object to set active
 * @param {string} screenId - Id of the screen to set the fileModel as the activeFile
 * 
 * @returns {void}
 */
export const setActiveFileFromType = (fileModel, screenId) => {
  switch(fileModel.fileType){
    case FILE_TYPES.REPORT:
      return setAltActiveFile(fileModel, screenId)
    case FILE_TYPES.UNIT:
    case FILE_TYPES.WAYPOINT:
    case FILE_TYPES.FEATURE:
    case FILE_TYPES.DEFINITION:
    // Eventually we want to support other file type clasifications
    // This includes general support, html and markdown class types
    // case FILE_TYPES.SUPPORT:
    // case FILE_TYPES.HTML:
    // case FILE_TYPES.DOCS:
      return setActiveFile(fileModel, screenId)
    default:
      return addToast({
        type: `error`,
        message: `Could not ${fileModel.name} active. Unknown file type ${fileModel.fileType}`,
      })
  }
}