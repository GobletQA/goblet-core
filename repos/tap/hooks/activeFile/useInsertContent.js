import { useCallback } from 'react'
import { insertContent } from 'HKActions/features/local/insertContent'
import { noOpObj } from '@keg-hub/jsutils'

export const useInsertContent = (props=noOpObj) => {
  const activeFile = useActiveFile(props.screenId)
  const { insertType, location } = props

  return useCallback((snippets) => {
    // TODO: @lance-tipton - use insertType, location to add code to activeFile
    // Works like snippets to add preformatted code to an activeFiles content
    insertContent(activeFile, snippets, location, insertType)
  }, [activeFile, insertType, location])
}