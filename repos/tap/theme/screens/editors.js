import { tapColors } from '../tapColors'

export const editors = theme => {
  const halfMargin = theme.margin.size / 2

  return {
    main: {
      flD: 'row',
    },
    surface: {
      main: {
        fl:1
      },
      content: {
        flWr: 'nowrap', 
        bgColor: tapColors.backGround
      }
    },
    full: {
      w: `100%`,
      h: `calc( 100vh - 150px )`,
    },
    feature: {
      main: {
        w: `100%`,
        h: `calc( 100vh - 150px )`,
      }
    },
    definitions: {
      main: {
        w: `100%`,
        h: `100%`,
        ovfY: 'auto',
      },
      editor: {
        w: `100%`,
        minH: `100px`,
      }
    },
    // This gets dynamically generated from the Constants.EDITOR_TABS.split.editors array
    // See components/codeEditor/codeEditor.js in the useEditorTabs hook
    ['feature-definitions']: {
      feature: {
        main: {
          h: `calc( 100vh - 150px )`,
          mR: halfMargin,
        },
      },
      definitions: {
        main: {
          mL: halfMargin,
          h: `100%`,
          ovfY: 'auto',
        },
        editor: {
          w: `100%`,
          minH: `100px`,
        }
      },
    },
    // This gets dynamically generated from the Constants.EDITOR_TABS.split.editors array
    // See components/codeEditor/codeEditor.js in the useEditorTabs hook
    ['definition-definitions']: {
      definition: {
        main: {
          h: `calc( 100vh - 150px )`,
          mR: halfMargin,
        }
      },
      definitions: {
        main: {
          h: `100%`,
          mL: halfMargin,
          ovfY: 'auto',
        },
        editor: {
          w: `100%`,
          minH: `100px`,
        }
      },
    },
    actions: {
      default: {
        main: {
          flD: 'row',
          alS: 'flex-end',
          mR: theme.margin.size,
        },
      },
      showRun: {
        save: { mR: 15 },
      }
    }
  }
}
