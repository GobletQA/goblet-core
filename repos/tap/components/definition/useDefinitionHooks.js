import {useState, useCallback, useMemo} from 'react'
import { Values } from 'HKConstants'
import { addToast } from 'HKActions/toasts'
import { useSelector } from 'HKHooks/useSelector'
import { useActiveTab } from 'HKHooks/useActiveTab'
import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { saveFile } from 'HKActions/files/api/saveFile'
import { getQueryData } from 'HKUtils/url/getQueryData'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { updateUrlQuery, removeFromQuery } from 'HKUtils/url/updateUrlQuery'

const { DEFINITION_TABS, CATEGORIES } = Values

/**
 * Hook resets the active definition file in the query params when switching back to the definitions list tab
 * If found, it updates the components state to match the them
 * @function
 * @param {Object} definitions - All currently loaded definitions from the store
 * @param {string} activeTab - Tab passed from parent component that should be the activeTab
 *
 * @return {Object} - Contains the activeDefinition fileModel and active definition tab
 */
const onDefinitionsList = (setTab) => {
  return useCallback(async (...args) => {
    DEFINITION_TABS.LIST === args[0] && removeFromQuery([`definition`, `definitionTab`])
    
    checkCall(setTab, ...args)
  }, [setTab])
}

/**
 * Hook that checks the current url for definitions query params
 * If found, it updates the components state to match the them
 * @function
 * @param {Object} definitions - All currently loaded definitions from the store
 * @param {string} activeTab - Tab passed from parent component that should be the activeTab
 *
 * @return {Object} - Contains the activeDefinition fileModel and active definition tab
 */
const useUrlActiveDefinition = (definitions, activeTab) => {
  const queryObj = getQueryData()
  return useMemo(() => {
    if(!definitions || !queryObj?.definition) return noOpObj
    const defName = queryObj?.definition
    const definition = Object.values(definitions).find(fileModel => fileModel.name === defName)
    
    const definitionTab = activeTab === DEFINITION_TABS.ACTIVE || activeTab === DEFINITION_TABS.LIST
      ? activeTab
      : queryObj?.definitionTab === DEFINITION_TABS.ACTIVE
        ? DEFINITION_TABS.ACTIVE
        : DEFINITION_TABS.LIST

    return {definition, definitionTab}
  }, [
    activeTab,
    definitions,
    queryObj?.definition,
    queryObj?.definitionTab,
  ])
}

/**
 * Hook called when saving a modified definition fileModel
 * @function
 * @param {Object} definition - Currently active definition fileModel
 *
 * @return {void}
 */
const useSaveDefinition = definition => {
  const {pendingFiles = noOpObj} = useStoreItems([CATEGORIES.PENDING_FILES])
  return useCallback(async event => {

    const pendingContent = pendingFiles[definition?.location]
    if(!pendingContent || definition?.content === pendingContent) 
      return addToast({
        type: 'warn',
        message: `File was not saved because it has not been changed`
      })

    await saveFile({
      ...definition,
      content: pendingContent,
    })

  }, [definition, pendingFiles[definition?.location]])
}

/**
 * Hook called when a definition is set to edit mode from the definitions list
 * @function
 * @param {string} tab - The current definitions tab
 * @param {function} setTab - Method to update the current active definitions tab
 * @param {Object} definition - Currently active definition fileModel
 * @param {function} setActiveDefinition - Method to update the activeDefinition
 * @param {Object} definitions - All currently loaded definitions from the store
 *
 * @return {void}
 */
const useEditDefinition = (tab, setTab, definition, setActiveDefinition, definitions) => {
  return useCallback(def => {
    if(!def || definition === def) return

    const defFileModel = definitions[def?.parent?.location]
    updateUrlQuery({
      definition: defFileModel.name,
      definitionTab: DEFINITION_TABS.ACTIVE
    }, true)

    setActiveDefinition(defFileModel)
    setTab(DEFINITION_TABS.ACTIVE)
  }, [
    tab,
    setTab,
    definition,
    definitions,
    setActiveDefinition
  ])
}

/**
 * Method To combine all definition editor hooks into a single function for code clarity
 * If found, it updates the components state to match the them
 * @function
 * @param {Object} props - All props passed to the component
 * @param {string} props.activeTab - Tab passed from parent component that should be the activeTab
 *
 * @return {Object} - Contains the activeDefinition fileModel and active definition tab and editor callback methods
 */
export const useDefinitionHooks = props => {
  const { activeTab } = props
  
  const { definitionTypes, definitions } = useSelector(
    CATEGORIES.DEFINITION_TYPES,
    CATEGORIES.DEFINITIONS
  )

  const {definition:urlDefinition, definitionTab} = useUrlActiveDefinition(definitions, activeTab)

  const [activeDefinition, setActiveDefinition] = useState(urlDefinition)
  const [tab, setTab] = useActiveTab(definitionTab || DEFINITION_TABS.LIST)

  const onSaveDefinition = useSaveDefinition(activeDefinition)
  const onEditDefinition = useEditDefinition(
    tab,
    setTab,
    activeDefinition,
    setActiveDefinition,
    definitions
  )
  
  const switchTabs = onDefinitionsList(setTab)

  return {
    tab,
    switchTabs,
    definitionTypes,
    onSaveDefinition,
    onEditDefinition,
    activeDefinition,
    setActiveDefinition,
  }
}