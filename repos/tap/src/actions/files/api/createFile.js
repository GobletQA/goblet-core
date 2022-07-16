import { getStore } from 'HKStore'
import { noOpObj } from '@keg-hub/jsutils'
import { addToast } from 'HKActions/toasts'
import { createApiFile } from 'HKUtils/api/createApiFile'
import { getFileTree } from 'HKActions/files/api/getFileTree'
import { setActiveFileFromType } from '../local/setActiveFileFromType'

/**
 * Checks the file extension based on fileType, and adds it if needed
 * @param {string} fileType - The type of file being checked
 * @param {string} fileName - Name of the file to check
 *
 * @returns {string} - Update fileName with it's extension added
 */
const ensureExtension = (fileType, fileName) => {
  const { items } = getStore().getState()
  const fileTypes = items?.repo?.fileTypes

  if(!fileTypes || !fileTypes[fileType])
    return { error: `Missing valid file types for repo. Please reconnect the repository` }

  const typeMeta = fileTypes[fileType]
  if(!typeMeta || !typeMeta.ext)
    return {error: [
      `File type "${fileType}" is misconfigured in the repos "goblet.config.js".`,
      `Please fix configuration for this file type to resolve the issue.`
    ].join(`\n`)}

  const ext = typeMeta.ext
  if (!fileName.includes('.')) return {file: `${fileName}.${ext}`}

  const last = fileName.split('.').pop()
  return last === ext
    ? {file: fileName}
    : {error: [
        `Invalid extension ".${last}".`,
        `Files of type "${fileType}" must include ".${ext}" at the end.`
      ].join(`\n`)}
}

/**
 * Creates a new file from the passed in fileModel
 * @param {string} fileType - The type of file being created
 * @param {string} fileName - Name of the file to create
 * @param {string} screenId - If passed, will set the new file as the activeFile for this screen
 *
 * @returns {Object} - {success, fileModel}
 */
export const createFile = async (fileType, fileName, screenId) => {
  const { file, error } = ensureExtension(fileType, fileName)

  if (error)
    return addToast({
      type: `error`,
      timeout: 10000,
      message: error,
    })

  addToast({
    type: 'info',
    message: `Creating new file ${file}!`,
  })

  const resp = await createApiFile({
    name: file,
    type: fileType,
  })
  if(!resp?.success) return noOpObj

  const { file: fileModel } = resp?.data
  
  if(!fileModel)
    return addToast({
      type: 'error',
      message: `File was created, but server returned an invalid response`,
    })
  
  addToast({
    type: 'success',
    message: `New file ${fileModel.name} was created!`,
  })

  // reload the file tree after the new file was created
  getFileTree()

  screenId && setActiveFileFromType(fileModel, screenId)

  return resp?.data
}
