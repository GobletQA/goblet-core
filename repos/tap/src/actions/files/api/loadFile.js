import { getStore } from 'HKStore'
import { Values } from 'HKConstants'
import { loadApiFile } from 'HKUtils/api'
import { isObj } from '@keg-hub/jsutils'
import { addToast } from '../../toasts/addToast'
import { setActiveFileFromType } from '../local/setActiveFileFromType'

const { CATEGORIES } = Values

/**
 * Helper to find the treeNodeModel of the passed in file
 * Matches a node, a node's location or a node's name
 * @type function
 * @param {Array} nodes - Loaded treeNodeModels from the Store
 * @param {Object|string} file - treeNodeModel, name or location of the test file
 *
 * @return {Object} - Found treeNodeModel of the passed in file
 */
const findFileInTree = (nodes, file) =>
  nodes.find(
    node => node === file || node.location === file || node.name === file
  )

/**
 * Sets a test file as the activeFile, after loading it's fileModel from the backend
 * Then calls setActiveFileFromType to set the file Active
 * @type function
 * @param {Object|string} fileNode - treeNodeModel, name or location of the test file
 * @param {string} screenId - Id of the screen to load the fileModel for
 * @param {boolean} mergeQuery - Merge the current url query string with the updated file
 
 *
 * @return {void}
 */
export const loadFile = async (fileNode, screenId, mergeQuery) => {
  const { items } = getStore()?.getState()
  if (!items) return

  const fileTree = items[CATEGORIES.FILE_TREE]
  const fileName = isObj(fileNode) ? fileNode.name : fileNode
  
  const nodeToLoad = findFileInTree(fileTree.nodes, fileNode)
  if (!nodeToLoad)
    return addToast({
      type: `warn`,
      message: `Could not load file ${fileName}. It does not exist in the file tree`,
    })

  const resp = await loadApiFile(nodeToLoad.location)
  const { file: fileModel } = resp?.data

  return fileModel
    ? setActiveFileFromType(fileModel, screenId, mergeQuery)
    : addToast({
        type: `warn`,
        message: `Could not load file ${fileName} from the API!`,
      })
}
