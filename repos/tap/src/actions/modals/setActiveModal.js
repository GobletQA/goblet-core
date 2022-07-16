import { dispatch } from 'HKStore'
import { noOpObj } from '@keg-hub/jsutils'
import { ActionTypes, Values } from 'HKConstants'
import { getLocalModalState } from './localModalState'

const { CATEGORIES, MODAL_TYPES } = Values

/**
 * Sets a modals visitable state based on passed in arguments
 * If the modal has localModal state true, then will not be set active
 * @param {string} modalType - modal types from values.MODAL_TYPES
 * @param {Boolean} visible - Flag for the modal visitable state
 * 
 * @returns {Void}
 */
export const setActiveModal = async (modalType, visible = true, modalProps=noOpObj) => {

  if(!MODAL_TYPES[modalType])
    return console.warn(`Modal of type ${modalType} does not exist`)

  const hasBeenSeen = MODAL_TYPES.NO_LOCAL_MOUNT === modalType
    ? await getLocalModalState(modalType)
    : false

  !hasBeenSeen &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        category: CATEGORIES.MODALS,
        items: {
          visible,
          props: modalProps,
          activeModal: modalType,
        },
      },
    })
}
