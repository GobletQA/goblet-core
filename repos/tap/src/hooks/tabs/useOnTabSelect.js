import { useCallback } from 'react'
import { isFunc, noPropArr } from '@keg-hub/jsutils'

/**
 * Helper hook for switching between different tabs of the tabbar
 * Returned method should be passed to the Tabbar component as the onTabSelect prop
 * @param {string} tab - Active tab
 * @param {function} setTab - Method for setting a tab active
 * @param {function} onTabSelect - Prop method passed from the parent to override the setTab method
 * @param {Array<string>} ignore - Will ignore the event when the newTab matches anything in the array
 *
 * @return {function} - Callback called when a tab is clicked
 */
export const useOnTabSelect = (tab, setTab, onTabSelect, ignore=noPropArr) =>
  useCallback(
    newTab => {
      return ignore.includes(newTab)
        ? undefined
        : isFunc(onTabSelect)
          ? onTabSelect(newTab, tab)
          : (tab !== newTab && isFunc(setTab) && setTab(newTab)) || true
    },
    [tab, setTab, onTabSelect, ignore]
  )
