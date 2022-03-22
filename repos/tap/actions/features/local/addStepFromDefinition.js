import { addToast } from 'HKActions/toasts'
import { Values } from 'HKConstants'
import { copyToDefinitionClipboard } from 'HKUtils/definitions'

const { CATEGORIES } = Values

/**
 * Adds a step from the definition to currently active feature
 * Uses the context to find the active scenario
 * Based on editor cursor location or active scenario
 * @function
 * @public
 * @export
 * @param {Object} items - Redux store items containing the features and activeData
 *
 * @return {Object} - Found active feature
 */
export const addStepFromDefinition = args => {
  const { definition, clipboard } = args
  if (!clipboard)
    return addToast({
      type: 'warn',
      message: `Clipboard does not exist!`,
    })

  addToast({
    type: 'info',
    message: `Copied step definition to clipboard!`,
  })

  return copyToDefinitionClipboard(definition)

  // TODO: Add other options for auto setting the step definition into the feature
}
