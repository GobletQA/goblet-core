import { deepFreeze } from '@keg-hub/jsutils'

/**
 * Constants for referencing modal types
 * Allows two way referencing by mapping all keys as values interchangeably
 * @type {Object}
*/
const modalTypes = Object.entries({
  SIGN_IN: 'signIn',
  NO_LOCAL_MOUNT: 'noLocalMount',
  CONNECT_REPO: 'connectRepoModal',
  TEST_SELECTOR: 'testSelectorModal',
  CONFIRM_REMOVE_FILE: `confirmRemoveFile`,
}).reduce((acc, [key, value]) => {
  acc[key] = value
  acc[value] = key

  return acc
}, {})

export const types = deepFreeze({
  MODAL_TYPES: modalTypes,
  EDITOR_TYPES: {
    FEATURE: 'feature',
    WAYPOINT: 'waypoint',
    DEFINITION: 'definition',
    DEFINITIONS: 'definitions',
    SCREENCAST: 'screencast',
  },
  // These are the default types, but will be overwritten
  // by the fileTypes set in the repo.fileTypes object when a repo is mounted
  FILE_TYPES: {
    FEATURE: 'feature',
    REPORT: 'report',
    DEFINITION: 'definition',
    WAYPOINT: 'waypoint',
    UNIT: 'unit',
    // Eventually we want to support other file type clasifications
    // This includes general support, html and markdown class types
    SUPPORT: 'support',
    HTML: 'html',
    DOCS: 'docs',
  },
  SIDEBAR_TYPES: {
    FILE_TREE: 'fileTree',
  },
  STEP_TYPES: ['and', 'given', 'when', 'then'],
  SOCKR_MSG_TYPES: {
    CMD_RUN: 'cmdRun',
    STD_OUT: 'stdOut',
    STD_ERR: 'stdErr',
    CMD_END: 'cmdEnd',
    CMD_FAIL: 'cmdFail',
    AUTH_TOKEN: 'authToken',
    BROWSER_STATUS: `browserStatus`,
    BROWSER_RECORDER: 'browserRecorder',
    BROWSER_RUN_TESTS: `browserRunTests`
  },
  STATUS_TYPES: {
    VNC: 'vnc',
    LOCAL: 'local',
  },
  EDITOR_MODE_TYPES: {
    feature: `gherkin`,
    definition: `javascript`,
    default: `javascript`,
    html: `html`,
    javascript: `javascript`,
    js: `javascript`,
    json: `json`,
    report: `html`,
    support: `javascript`,
    waypoint: `javascript`,
    unit: `javascript`,
  },
})
