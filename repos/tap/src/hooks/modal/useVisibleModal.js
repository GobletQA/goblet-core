import { Values } from 'HKConstants'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { noOpObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

/**
 * Returns the visible modal name if exists
 * @returns {string|null}
 */
export const useVisibleModal = () => {
  const { modals = noOpObj } = useStoreItems([CATEGORIES.MODALS])
  return modals?.visible ? modals?.activeModal : null
}
