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
    editorRef:parentRef,
    activeFile, // The fileModel of the activeFile (activeFile.content === value)
    editorId, // ID to use for the specific editor
    fileId, // Absolute Path to the file
    mode, // Coding language
    onMount,
    onBeforeMount,
    onChange, // Callback called when the value changes
    setTab,
    style=noOpObj,
    value // Actual code of the file
  } = props

  const editorRef = useRef(null)

  const onMountCB = useCallback((editor, monaco) => {
    isFunc(parentRef)
      ? parentRef(editor)
      : parentRef && (parentRef.current = editor)
  
    editorRef.current = editor
    onMount?.(editor, monaco)
  }, [onMount, activeFile, value, parentRef])

  const onChangeCB = useCallback((updated, evt) => {
    onChange?.(updated, evt)
  }, [onChange, activeFile, value])


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
      className: `herkin-monaco-editor editor-type-${mode}`,
      options: {
        'semanticHighlighting.enabled': true,
        fontSize: 14,
        useShadows: false,
        scrollBeyondLastLine: false,
        wordWrap: 'bounded',
        codeLens: false,
        contextmenu: false,
        horizontal: 'hidden',
      }
    }
  }, [style, mode])

  return (
    <Editor
      {...editorProps}
      path={fileId}
      beforeMount={onBeforeMount}
      onMount={onMountCB}
      onChange={onChangeCB}
      defaultValue={value}
      defaultLanguage={mode}
    />
  )
}