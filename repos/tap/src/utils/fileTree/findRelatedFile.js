/**
 * Helper to find the treeNodeModel of the passed in file
 * Matches a node, a node's location or a node's name
 * @type function
 * @param {Array} nodes - Loaded treeNodeModels from the Store
 * @param {Object|string} file - treeNodeModel, name or location of the test file
 *
 * @return {Object} - Found treeNodeModel of the passed in file
 */
export const findRelatedFile = (nodes, reportFile) => {
  const locSplit = reportFile.replace('.html', '').split('/')
  const nodeName = locSplit.pop()
  const nodeType = locSplit.pop()
  return nodes.find(
    node => node.name === nodeName && node.fileType === nodeType
  )
}
