

export const types = {
  MODAL_TYPES: {
    TEST_SELECTOR: 'testSelectorModal',
    CREATE_FILE: 'createFileModal',
  },
  EDITOR_TYPES: {
    FEATURE: 'feature',
    DEFINITION: 'definition',
    DEFINITIONS: 'definitions',
  },
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
    FILE_TREE: 'fileTree'
  },
  STEP_TYPES: [
    'and',
    'given',
    'when',
    'then',
  ],
  SOCKR_MSG_TYPES: {
    CMD_RUN: 'cmdRun',
    STD_OUT: 'stdOut',
    STD_ERR: 'stdErr',
    CMD_END: 'cmdEnd',
    CMD_FAIL: 'cmdFail',
  },
}