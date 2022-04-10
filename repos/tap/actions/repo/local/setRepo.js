import { dispatch } from 'HKStore'
import { Values, ActionTypes } from 'HKConstants'
import { setFileTypeConstants } from 'HKConstants/values'
import { upsertFeatures } from 'HKActions/features/local'
import { upsertDefinitions } from 'HKActions/definitions/local'
import { setFileTree } from 'HKActions/files/local/setFileTree'
const { STORAGE } = Values

/**
 * Updates the store with any repo / file content that exists in the passed in params
 * Used by repo/api/connect && repo/api/status actions
 *
 */
export const setRepo = params => {
  const { repo, fileTree, features, definitions, definitionTypes } = params

  repo.fileTypes &&
    setFileTypeConstants(
      Object.keys(repo.fileTypes)
      .reduce((acc, type) => {
        acc[type.toUpperCase()] = type

        return acc
      }, {})
    )

  repo &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        category: STORAGE.REPO,
        items: repo,
        plugins: { localStorage: { persist: STORAGE.REPO } },
      },
    })

  features && upsertFeatures(features)

  definitions &&
    definitionTypes &&
    upsertDefinitions(definitions, definitionTypes)

  fileTree && setFileTree(fileTree)
}
