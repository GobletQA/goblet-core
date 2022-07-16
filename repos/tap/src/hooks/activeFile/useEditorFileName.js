import { useMemo } from 'react'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { getFileName } from 'HKUtils/fileTree/getFileName'
import { useStoreItems } from 'HKHooks/store/useStoreItems'

const { CATEGORIES } = Values

/**
 * Check is an active files has pending content creates a title with a pending indicator
 * @param {Object} activeFile - The file with pending content
 *
 * @returns {string} - Memoized file type with pending mark when pending content exists
 */
export const useEditorFileName = activeFile => {
  const { pendingFiles = noOpObj } = useStoreItems([CATEGORIES.PENDING_FILES])
  const hasPending = Boolean(pendingFiles[activeFile?.location])

  return useMemo(() => {
    if(!activeFile || !activeFile?.relative) return ``

    const pendingMark = hasPending ? '*' : ''
    return `${getFileName(activeFile?.relative)} ${pendingMark}`.trim()
  }, [hasPending, activeFile?.relative])
}
