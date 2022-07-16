import { storage } from './storage'
import { deepFreeze } from '@keg-hub/jsutils'

export const categories = deepFreeze({
  CATEGORIES: {
    ...storage.STORAGE,
    STEPS: 'steps',
    FEATURES: 'features',
    DEFINITIONS: 'definitions',
    DEFINITION_TYPES: 'definitionTypes',
    UNITS: 'units',
    WAYPOINTS: 'waypoints',
    ACTIVE_FEATURE: 'activeFeature',
    ACTIVE_TAB: 'activeTab',
    TEST_RUNS: 'testFileOutput',
    CMD_RUNNING: 'cmdRunning',
    FEATURE: 'feature',
    SCREEN: 'screen',
    SCREENS: 'screens',
    COPY_STEP: 'copy_step',
    MODALS: 'modals',
    FILE_TREE: 'fileTree',
    SIDEBAR: 'sidebar',
    PENDING_FILES: 'pendingFiles',
    TOASTS: 'toasts',
    BROWSER_OPTS: 'browserOpts',
    SCREENCAST_STATUS: 'screencastStatus',
    PROVIDER_REPOS: 'providerRepos',
    SPEC_RESULTS: `specResults`,
    RECORD_RESULTS: `recordResults`,
    RECORDING_BROWSER: 'recordingBrowser',
    RECORDING_ACTIONS: `recordingActions` 
  },
  SUB_CATEGORIES: {
    NODES: 'nodes',
    ACTIVE_FILE: 'activeFile',
    MODIFIED_CONTENT: 'modified',
  },
})
