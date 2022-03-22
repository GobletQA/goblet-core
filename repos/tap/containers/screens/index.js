
import React, { lazy, Suspense } from 'react'
import { Values } from 'HKConstants'
import { Code } from 'HKAssets/icons/code'
import { Desktop } from 'HKAssets/icons/desktop'
import { Loading } from '@keg-hub/keg-components'
import { ClipboardCheck } from 'HKAssets/icons/clipboardCheck'

const { FILE_TYPES, SCREENS } = Values

/**
 * Helper to lazy load Screens when the are fist accessed and not all at once
 */
const LoadScreen = Screen => {
  return props => {
    return (
      <Suspense fallback={<Loading />} >
        <Screen {...props} />
      </Suspense>
    )
  }
}

const LazyEmptyScreen = lazy(() => import('./emptyScreen'))
export const EmptyScreen = LoadScreen(LazyEmptyScreen)
EmptyScreen.tabId = SCREENS.EMPTY
EmptyScreen.tabTitle = `Empty`

const LazyEditorScreen = lazy(() => import('./editorScreen'))
export const EditorScreen = LoadScreen(LazyEditorScreen)
EditorScreen.tabIcon = Code
EditorScreen.tabId = SCREENS.EDITOR
EditorScreen.tabTitle = `Code Editor`
EditorScreen.fileTypes = [
  FILE_TYPES.FEATURE,
  FILE_TYPES.DEFINITION,
  FILE_TYPES.WAYPOINT,
  FILE_TYPES.UNIT,
  FILE_TYPES.SUPPORT,
  FILE_TYPES.DOCS,
  FILE_TYPES.HTML,
]

const LazyScreencastScreen = lazy(() => import('./screencastScreen'))
export const ScreencastScreen = LoadScreen(LazyScreencastScreen)
ScreencastScreen.tabIcon = Desktop
ScreencastScreen.tabTitle = `Screencast`
ScreencastScreen.tabId = SCREENS.SCREENCAST
ScreencastScreen.fileTypes = [
  FILE_TYPES.FEATURE,
  FILE_TYPES.DEFINITION,
  FILE_TYPES.WAYPOINT,
  FILE_TYPES.UNIT,
  FILE_TYPES.SUPPORT,
  FILE_TYPES.DOCS,
  FILE_TYPES.HTML,
]

const LazyReportsScreen = lazy(() => import('./reportsScreen'))
export const ReportsScreen = LoadScreen(LazyReportsScreen)
ReportsScreen.tabId = SCREENS.REPORTS
ReportsScreen.tabTitle = `Test Reports`
ReportsScreen.tabIcon = ClipboardCheck
ReportsScreen.fileTypes = [FILE_TYPES.REPORT]
