import { useCallback } from 'react'
import { Values } from 'HKConstants'
import { saveFile } from 'HKActions/files/api/saveFile'
import { noOpObj, isFunc, exists } from '@keg-hub/jsutils'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { useActiveFile } from 'HKHooks/activeFile/useActiveFile'
import { savePendingContent } from 'HKActions/files/local/savePendingContent'
const { CATEGORIES } = Values

/**
 * Hook to save the activeFile by calling the saveFile action
 * Gets called by the SaveFileButton and the SaveFileIcon button
 * SaveFileButton
 *  - Has an onSave callback that saves the file on it's own
 *  - If then returns false, telling this method not to save the file
 *  - This is why we check the response from the onSave callback
 *  - If it's false, we skip saving  the file here
 * SaveFileIcon
 *  - Doesn't have an onSave callback, so the file is saved from this method
 * @param {Object} props
 *
 * @returns {function} - Callback to call when running tests on the active file
 */
 export const useSaveActiveFile = props => {
  const {activeFile:propsActiveFile, onSave, screenId} = props

  const activeFile = useActiveFile(screenId)
  const { pendingFiles = noOpObj } = useStoreItems([CATEGORIES.PENDING_FILES])
  const fileModel = propsActiveFile || activeFile || noOpObj

  const pendingFile = pendingFiles[fileModel.uuid]

  return useCallback(
    async event => {
      /**
       * Call the passed in onSave callback if it exists
       * If it returns false, then don't do anything else in this callback
       * Otherwise save the current active file
       */
      const shouldContinue = isFunc(onSave) ? await onSave(event, fileModel) : true
      if(!shouldContinue){
        console.warn(`onSave callback returned false, Not saving file`)
        return
      }

      /**
       * If there's pending content, then save the file via the savePendingContent method
       * Otherwise call the normal saveFile method
       */
      exists(pendingFile) && pendingFile !== fileModel.content
        ? savePendingContent(pendingFile, fileModel)
        : saveFile(fileModel)
    },
    [onSave, fileModel, pendingFile]
  )
}
