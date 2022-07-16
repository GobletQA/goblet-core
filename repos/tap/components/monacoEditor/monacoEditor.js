import React, { useState, useMemo, useCallback, useRef } from "react";
import Editor from '@monaco-editor/react'
import { isFunc, noOpObj } from '@keg-hub/jsutils'

// const settings = {
//   acceptSuggestionOnCommitCharacter: true,
//   acceptSuggestionOnEnter: "on",
//   accessibilitySupport: "auto",
//   autoIndent: false,
//   automaticLayout: true,
//   codeLens: true,
//   colorDecorators: true,
//   contextmenu: true,
//   cursorBlinking: "blink",
//   cursorSmoothCaretAnimation: false,
//   cursorStyle: "line",
//   disableLayerHinting: false,
//   disableMonospaceOptimizations: false,
//   dragAndDrop: false,
//   fixedOverflowWidgets: false,
//   folding: true,
//   foldingStrategy: "auto",
//   fontLigatures: false,
//   formatOnPaste: false,
//   formatOnType: false,
//   hideCursorInOverviewRuler: false,
//   highlightActiveIndentGuide: true,
//   links: true,
//   mouseWheelZoom: false,
//   multiCursorMergeOverlapping: true,
//   multiCursorModifier: "alt",
//   overviewRulerBorder: true,
//   overviewRulerLanes: 2,
//   quickSuggestions: true,
//   quickSuggestionsDelay: 100,
//   readOnly: false,
//   renderControlCharacters: false,
//   renderFinalNewline: true,
//   renderIndentGuides: true,
//   renderLineHighlight: "all",
//   renderWhitespace: "none",
//   revealHorizontalRightPadding: 30,
//   roundedSelection: true,
//   rulers: [],
//   scrollBeyondLastColumn: 5,
//   scrollBeyondLastLine: true,
//   selectOnLineNumbers: true,
//   selectionClipboard: true,
//   selectionHighlight: true,
//   showFoldingControls: "mouseover",
//   smoothScrolling: false,
//   suggestOnTriggerCharacters: true,
//   wordBasedSuggestions: true,
//   wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
//   wordWrap: "off",
//   wordWrapBreakAfterCharacters: "\t})]?|&,;",
//   wordWrapBreakBeforeCharacters: "{([+",
//   wordWrapBreakObtrusiveCharacters: ".",
//   wordWrapColumn: 80,
//   wordWrapMinified: true,
//   wrappingIndent: "none"
// }


export const MonacoEditor = props => {
  const {
    mode, // Coding language
    value, // Actual code of the file
    setTab,
    fileId, // Absolute Path to the file
    onMount,
    onChange, // Callback called when the value changes
    editorId, // ID to use for the specific editor
    activeFile, // The fileModel of the activeFile (activeFile.content === value)
    glyphMargin,
    defaultValue,  // Initial value of code if value is not set
    style=noOpObj,
    onBeforeMount,
    editorRef:parentRef,
  } = props

  const editorRef = useRef(null)

  const onMountCB = useCallback((editor, monaco) => {
    isFunc(parentRef)
      ? parentRef(editor)
      : parentRef && (parentRef.current = editor)
  
    editorRef.current = editor
    monaco.editor.getModels().map(model => {
      model.updateOptions({ tabSize: 2, insertSpaces: true })
    })

    onMount?.(editor, monaco)
  }, [onMount, activeFile, value, parentRef])

  const editorProps = useMemo(() => {
    return {
      theme: "vs-dark",
      width: style.width || `100%`,
      // TODO: Fix the height calculation
      // monaco editor tries to auto-set the heigh based on the parent when height is 100%
      // This causes an recursive loop of setting the height over and over again
      // Need figure out the parent first, then pass it down via the style.height prop
      // The 175px value comes from adding the heights of the header, top tab-bar and bottom tab-bar together
      // If any of those values change, then the 175px value also has to change
      // Would be better if it was set automatically
      height: style.height || `calc( 100vh - 175px )`,
      className: `goblet-monaco-editor editor-type-${mode}`,
      options: {
        'semanticHighlighting.enabled': true,
        fontSize: 14,
        codeLens: false,
        useShadows: false,
        contextmenu: false,
        wordWrapColumn: 200,
        wordWrap: 'bounded',
        horizontal: 'hidden',
        lineNumbersMinChars: 3,
        glyphMargin: glyphMargin,
      }
    }
  }, [style, mode, glyphMargin])

  return (
    <Editor
      {...editorProps}
      value={value}
      path={fileId}
      onMount={onMountCB}
      onChange={onChange}
      defaultLanguage={mode}
      beforeMount={onBeforeMount}
      defaultValue={defaultValue}
    />
  )
}