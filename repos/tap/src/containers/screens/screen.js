import React, { useMemo } from 'react'
import * as Screens from './index'
import { Values } from 'HKConstants'
import { Tabbar } from 'HKComponents/tabbar'
import { deepMerge, capitalize } from '@keg-hub/jsutils'
import { useScreenSelect } from 'HKHooks/useScreenSelect'
import { useStoreItems } from 'HKHooks/store/useStoreItems'
import { ReScreenParent, ReHeaderSpacer } from './screens.restyle'

const { CATEGORIES, SCREENS } = Values

/**
 * Screen Tabs built to match the screenModels in the store
 * Looks each export screen component, and generates it's model
 * @type Array
 */
const screenTabs = Object.values(Screens).reduce((acc, View) => {
  ;(SCREENS.SCREENCAST || View.tabTitle !== 'Screencast') &&
    acc.push({
      View,
      id: View.tabId,
      Icon: View.tabIcon,
      fileTypes: View.fileTypes,
      title:
        View.tabId !== SCREENS.EMPTY
          ? View.tabTitle || capitalize(View.tabId)
          : undefined,
    })

  return acc
}, [])

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
    const foundTab = screenTabs.find(item =>
      id ? item.id === id : screenModels[item.id].active
    )

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
  const onTabSelect = useScreenSelect(screenTab, screenModels, screenTabs)

  return (
    (screenTab && (
      <ReScreenParent className={`screen-parent-main`}>
        <ReHeaderSpacer className={`screen-header-spacer`} />
        <Tabbar
          fixed
          type={'screens'}
          location={'top'}
          tabs={screenTabs}
          activeTab={screenTab.id}
          onTabSelect={onTabSelect}
        />
      </ReScreenParent>
    )) ||
    null
  )
}
