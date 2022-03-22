import { useCallback } from 'react'
import { addToast } from 'HKActions/toasts'
import { checkCall } from '@keg-hub/jsutils'
import { loadFile } from 'HKActions/files/api/loadFile'
import { openArtifact } from 'HKActions/artifacts/openArtifact'

/**
 * Helper to load a file based on it's type and fileType
 * @param {function} callback - Called first to allow override the file load if needed
 */
export const useLoadFileByType = (callback, ...args) => {
  return useCallback(
    async ({ node }) => {
      // Try to call the callback
      // If it explicitly returns false, then return without calling the switch
      const resp = checkCall(callback, node, ...args)
      if (resp === false) return

      switch (node?.type) {
        case 'folder':
          break
        case 'file':
          return node.fileType === 'artifact'
            ? openArtifact(node)
            : await loadFile(node.location)
        default:
          return addToast({
            type: 'error',
            message: `Unknown node type selected: ${node.type}`,
          })
      }
    },
    [callback, ...args]
  )
}
