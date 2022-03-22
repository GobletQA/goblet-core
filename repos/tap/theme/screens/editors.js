import { tapColors } from '../tapColors'

const vHSubBottomBar = {h: `calc( 100vh - 140px )`}
const fullHSubTopTab = {h: `calc( 100% - 30px )`}
const editorOvf = {ovfY: 'auto', ovfX: 'hidden'}
const activeEditor = {
  main: {
    w: `100%`,
    ...vHSubBottomBar,
  }
}
export const editors = theme => {

  // Default definitions list styles
  const definitions = {
    main: {
      h: `100%`,
      ...editorOvf,
    },
    activeEditor,
    editor: fullHSubTopTab,
  }

  return {
    main: {
      flD: 'row',
    },
    surface: {
      main: {
        fl: 1,
      },
      content: {
        flWr: 'nowrap',
        bgColor: tapColors.backGround,
      },
    },
    full: {
      feature: activeEditor,
      definitions: {
        main: {
          w: `100%`,
          h: `100%`,
          ...editorOvf,
        },
        activeEditor,
        editor: fullHSubTopTab,
      }
    },
    // This gets dynamically generated from the Constants.EDITOR_TABS.split.editors array
    // See components/codeEditor/codeEditor.js in the useEditorTabs hook
    ['feature-definitions']: {
      definitions,
      feature: {
        main: vHSubBottomBar,
      },
    },
    // This gets dynamically generated from the Constants.EDITOR_TABS.split.editors array
    // See components/codeEditor/codeEditor.js in the useEditorTabs hook
    ['definition-definitions']: {
      definitions,
      definition: {
        main: {
          ...editorOvf,
          ...vHSubBottomBar,
        },
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
      },
    },
  }
}
