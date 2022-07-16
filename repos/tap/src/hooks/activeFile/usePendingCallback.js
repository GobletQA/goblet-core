import { useCallback } from 'react'
import { getStore } from 'HKStore'
import { throttleLast } from '@keg-hub/jsutils'
import { getActiveFile } from 'HKUtils/helpers/getActiveFile'
import { removePendingFile, setPendingFile } from 'HKActions/files/local'

/**
 * Sets an active files pending content when it changes
 * @param {string=} screenId - Id of the screen the file is active on
 * @returns {function} - Callback to call when the activeFile content changes
 */
export const usePendingCallback = screenId => {
  // limit the amount of updates and improve performance with throttle
  return useCallback(
    throttleLast(
      text => {
        // during a file switch, this cb is called with the old activeFile
        // this occurs prior to the 'activeFile' being passed down
        // in this case, we want to make sure activeFile is actually the current active file
        const curActiveFile = getActiveFile(getStore()?.getState()?.items)

        // Only do the update if we have everything we need
        if (!text || !curActiveFile || !curActiveFile.content) return

        text && text === curActiveFile.content
          ? removePendingFile(curActiveFile)
          : setPendingFile(text, curActiveFile, screenId)
      },
      null,
      300
    ),
    [screenId]
  )
}
