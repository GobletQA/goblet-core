import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { isEmptyColl, noOpObj } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { getFileName } from 'HKUtils/fileTree/getFileName'

const { CATEGORIES, CREATE_NEW_FILE, TAP_PATH_PREFIX } = Values

/**
 * Default create new file object
 * Constants that allows for selecting creating new file from the select options
 * @type {Object}
 */
const createNewFile = {
  activeShowList: true,
  value: CREATE_NEW_FILE,
  label: CREATE_NEW_FILE,
}

/**
 * Gets all files in the fileTree and separates them out into groups
 * The items in the fileTypes should align with the fileTree node.fileTypes
 * So using the fileTypes, we can group the nodes
 * This allows filtering in the UI, when a specific file type is selected
 * @param {Array<Object>} fileTypes - Group of allowed file types including type and folder name 
 * @returns {Object} - Groups files by fileType from file tree
 */
export const useFileGroups = (fileTypes) => {
  const { fileTree, definitions } = useStoreItems([
    CATEGORIES.DEFINITIONS,
    CATEGORIES.FILE_TREE,
  ])

  return useMemo(() => {
    if(!fileTypes || !fileTypes.length) return noOpObj
    
    // Ensure all file types are added to the fileGroups
    // Add the default create file object for each type
    const fileGroups = fileTypes.reduce((acc, fileType) => {
      acc[fileType.value] = acc[fileType.value] || [createNewFile]

      return acc
    }, {})
    
    if (!fileTree || !fileTree.nodes || isEmptyColl(fileTree.nodes))
      return fileGroups

    // Definitions are a bit of an edge case so add them separately
     Object.values(definitions)
      .map(def => {
        if(def.location.includes(TAP_PATH_PREFIX)) return
        const name = getFileName(def.location, fileGroups.definition)
        fileGroups.definition.push({
          // To work with AutoComplete
          key: name,
          text: name,
          // To work with Select
          label: name,
          value: name
        })
        fileGroups.definition[name] = def
      })

    // Loop the fileTree, and add each node to a fileGroup based on it's fileType
    return fileTree.nodes.reduce((acc, node) => {
      if (node.type !== 'file') return acc
      
      // Ensure only allowed file types exist in the fileGroups
      if(!acc[node.fileType]){
        console.warn(`Found file type that does not match allowed file types`, node)
        return acc
      }

      // Ensure the file type is added
      acc[node.fileType] = acc[node.fileType] || []

      const name = getFileName(node.location, acc[node.fileType])
      acc[node.fileType].push({
        // To work with AutoComplete
        key: name,
        text: name,
        // To work with Select
        label: name,
        value: name
      })

      // Add a lookup by name more easily find the node from the name
      acc[node.fileType][name] = node

      return acc
    }, fileGroups)

  }, [fileTypes, fileTree.nodes, definitions])
}
