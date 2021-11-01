import React, { useMemo, useCallback } from 'react'
import * as Screens from './index'
import { Values } from 'SVConstants'
import { View, Tabbar } from 'SVComponents'
import { reStyle } from '@keg-hub/re-theme/reStyle'
import { useScreenSelect } from 'SVHooks/useScreenSelect'
import { useStoreItems } from 'SVHooks/store/useStoreItems'
import { setScreenById } from 'SVActions/screens/setScreenById'
import { deepMerge, isEmpty, exists, capitalize, noOpObj } from '@keg-hub/jsutils'

const { CATEGORIES, SCREENS } = Values

/**
 * Restyle View component that wraps the Main Tabbar
 */
const ScreenParent = reStyle(View)(theme => ({
  tp: 0,
  fl: 1,
  mT: 95,
  mW: `100vw`,
  zI: -1,
  ovf: 'scroll',
  pos: 'relative',
  pH: theme?.padding?.size / 3,
  bgC: theme?.tapColors?.appBackground,
}))

/**
 * Screen Tabs built to match the screenModels in the store
 * Looks each export screen component, and generates it's model
 * @type Array
 */
const screenTabs = Object.values(Screens)
  .map(View => ({
    View,
    id: View.tabId,
    Icon: View.tabIcon,
    title: View.tabId !== SCREENS.EMPTY
      ? View.tabTitle || capitalize(View.tabId)
      : undefined
  }))

/**
 * Hook to merge the local tabs with the screenModels to make a screenTab
 * @type function
 * @param {string} id - Id of the active screen, uses the stores active screen if not passed
 *
 * @returns {Object} screenTab - screenModel and screenTab objects merged
 */
const useScreenTab = (id, screenModels) => {
  return useMemo(() => {
    // If an id is passed use that for finding the screen, otherwise use the active 
    const foundTab = screenTabs.find(item => (
      id ? item.id === id : screenModels[item.id].active
    )) 

    // Default to returning an empty screen
    return foundTab
      ? deepMerge(screenModels[foundTab.id], foundTab)
      : screenTabs[0]

  }, [id, screenModels])
}

/**
 * Screen - Renders Tabs component of screen tabs, from the props or active screen in the store
 * @param {object} props
 * @param {object} [props.activeScreen] - Currently active screen
 */
export const Screen = props => {
  const screenModels = useStoreItems(CATEGORIES.SCREENS)
  const screenTab = useScreenTab(props?.activeScreen, screenModels)
  const onTabSelect = useScreenSelect(screenTab, screenModels)

  return screenTab && (
    <ScreenParent className={`screen-parent-main`}>
      <Tabbar
        fixed
        type={'screens'}
        location={'top'}
        tabs={screenTabs}
        activeTab={screenTab.id}
        onTabSelect={onTabSelect}
      />
    </ScreenParent>
  ) || null

}