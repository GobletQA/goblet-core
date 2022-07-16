import { deepFreeze } from '@keg-hub/jsutils'

export const tabs = deepFreeze({
  // ID of the sticky bottom elemnt that contains a screen/editors tabs
  TABBAR_PORTAL_ID: `keg-tabbar-portal-root`,
  // Taps for the definitions editor
  DEFINITION_TABS: {
    ACTIVE: 'active-definitions',
    LIST: 'list-definitions',
  },
  // Tabs split by file type
  // Keys are in lowercase to allow direct mapping from fileModel.fileType property
  // Editors array is a list of editor components that display when that tab is active
  // If a specific editor does not exist, then it will use the default
  EDITOR_TABS: {
    feature: {
      split: {
        id: 'split',
        title: `Split`,
        editors: ['feature', 'definitions'],
      },
      feature: { id: 'feature', title: `Feature`, editors: ['feature'] },
      definitions: {
        id: 'definitions',
        title: `Definitions`,
        editors: ['definitions'],
      },
    },
    definition: {
      definition: {
        id: 'definition',
        title: `Definition`,
        editors: ['definition'],
      },
    },
    unit: {
      unit: { id: 'unit', title: `Unit Tests`, editors: ['units'] },
    },
    waypoint: {
      waypoint: {
        id: 'waypoint',
        title: `Waypoint Tests`,
        editors: ['waypoint'],
      },
      screencast: {
        disabled: true,
        id: 'screencast',
        title: `Browser Screencast`,
        editors: ['screencast'],
      },
      split: {
        id: 'split',
        title: `Split`,
        editors: ['waypoint', 'screencast'],
      },
    },
    file: {
      file: { id: 'other-file-type', title: `File`, editors: ['file'] },
    },
    // TODO: add editors for other file types
    // support / html / md(x) / etc...
  },
})
