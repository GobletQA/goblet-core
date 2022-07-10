import { Values } from 'HKConstants'
import { loadApiFile } from 'HKUtils/api'

/**
 * Removes the extension from a file name
 *
 * @param {string} name - Name of a file in the correct format
 *
 * @returns {string} - Name without the file extention
 */
const removeExt = name => {
  if(!name) return ``

  const nameSplit = name.split('.')
  return nameSplit.slice(0, nameSplit.length - 1).join('.')
}

/**
 * Builds a path referent to a fileTreeModel for comparison with a relative file
 * Removes the file extension and adds the type in a path like format
 *
 * @param {string} name - Name of a file in the correct format
 * @param {type} type - File type of the relative file to compare aginst
 *
 * @returns {string} - Generated path reference
 */
const buildRef = (name, type) => {
  if(!name) return ``

  const noExtName = removeExt(name)
  return `${type}/${noExtName}/${noExtName}-`
}

/**
 * Converts the passed in name to a date
 * Expects name to follow the <name>-<EPOCH Timestamp> format
 *
 * @param {string} name - Name of a file in the correct format
 *
 * @returns {Date} - Date parsed from the passed in name
 */
const getDateNum = name => {
  const dateStr = name
    ? parseInt(removeExt(name).split('-').pop(), 10)
    : ``
  return new Date(dateStr)
}

/**
 * Finds the most recent report relative to a current file
 * Depends on reports following the <activeFile.name>-<EPOCH Timestamp> format
 *
 * @params {Object} relativeFile - File relative to the test files being searched
 * @params {Array<Object>} nodes - Groups of fileTree models that could be related to the relativeFile
 *
 * @returns {Object|null} - Most recent Report file or undefined
 */
export const findRelatedReport = async (relativeFile, nodes) => {
  if(!relativeFile || !nodes) return
  
  const idRef = buildRef(relativeFile?.name, relativeFile?.fileType)
  const treeNode = nodes
    .filter(
      node =>
        node.type === 'file' &&
        node.fileType === Values.FILE_TYPES.REPORT &&
        node.id &&
        node.id.includes(idRef)
    )
    .sort((a, b) => {
      const aDate = getDateNum(a.name)
      const bDate = getDateNum(b.name)
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0
    })
    .shift()

  if(!treeNode) return

  const resp = await loadApiFile(treeNode?.location)
  return resp?.data?.file
}
