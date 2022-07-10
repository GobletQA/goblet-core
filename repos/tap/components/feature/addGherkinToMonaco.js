import {
  semanticTokenTypes,
  getGherkinDiagnostics,
  getGherkinSemanticTokens,
  getGherkinCompletionItems,
} from '@cucumber/language-service'
import { noOp } from '@keg-hub/jsutils'

/**
 * Setup syntax highlighting for the gherkin language
 * @param {Object} monaco - An instance of the monaco editor
 * @param {Array} expressions - Group of expressions relative to step definitions with a match function
 *
 * @returns {Void}
 */
const addGherkinSyntax = (monaco, expressions) => {
  monaco.languages.registerDocumentSemanticTokensProvider('gherkin', {
    getLegend: () => ({
      tokenTypes: semanticTokenTypes,
      tokenModifiers: [],
    }),
    releaseDocumentSemanticTokens: () => {},
    provideDocumentSemanticTokens: model => {
      const content = model.getValue()
      const tokens = getGherkinSemanticTokens(content, expressions)
      const data = new Uint32Array(tokens.data)
      return { data }
    },
  })
}

/**
 * Setup syntax highlighting for the gherkin language
 * @param {Object} monaco - An instance of the monaco editor
 * @param {Array} index - Group of step definitions to match auto-complete with
 * @param {Array} expressions - Group of expressions relative to step definitions
 *
 * @returns {Void}
 */
const addAutoComplete = (monaco, index) => {
  // Setup Auto-Complete when writing a feature file
  monaco.languages.registerCompletionItemProvider('gherkin', {
    provideCompletionItems: function (model, position) {
      const content = model.getValue()
      const completionItems = getGherkinCompletionItems(
        content,
        position.lineNumber - 1,
        index
      )
      return {
        suggestions: completionItems.map((completionItem) => ({
          label: completionItem.label,
          insertText: completionItem.textEdit.newText,
          kind: monaco.languages.CompletionItemKind.Text,
          range: convertRange(completionItem.textEdit.range),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
      }
    },
  })
}

/**
 * Adds step definition validation to the feature file
 * Will show error lines within the file content when step definition is missing
 * @param {Object} monaco - An instance of the monaco editor
 * @param {Array} expressions - Group of expressions relative to step definitions with a match function
 *
 * @returns {function} - Method to validate the step definitions
 */
const addDefinitionValidation = (monaco, expressions) => {
  // Diagnostics (Syntax validation)
  const runDefinitionValidation = () => {
    const model = editor.getModel()
    if (model) {
      const content = model.getValue()
      const diagnostics = getGherkinDiagnostics(content, expressions)
      const markers = diagnostics.map((diagnostic) => {
        return Object.assign(
          Object.assign({}, convertRange(diagnostic.range)),
          { severity: monaco.MarkerSeverity.Error, message: diagnostic.message }
        )
      })

      monaco.editor.setModelMarkers(model, 'gherkin', markers)
    }
  }
  const requestValidation = () => {
    window.requestAnimationFrame(() => runDefinitionValidation())
  }

  // Validate the definitions as soon as possible
  requestValidation()

  return requestValidation
}

/**
 * Converts an internal range value to a value monaco can understand
 * @param {Object} range - Internal gherkin range value
 *
 * @returns {Object} - monaco range value
 */
const convertRange = range => {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  }
}

/**
 * Sets up the Monaco editor to work with the gherkin language
 * Configures syntax highlighting and auto-complete for step definitions
 * @param {Object} monaco - An instance of the monaco editor
 * @param {Array} index - Group of step definitions to match auto-complete with
 * @param {Array} expressions - Group of expressions relative to step definitions
 *
 * @returns {function} - Method to configure the active monaco editor
 */
export const addGherkinToMonaco = (monaco, index, expressions) => {

  monaco.languages.register({
    id: 'gherkin',
    loader: noOp,
    extensions: [`.feature`],
    aliases: [`Feature`, `feature`]
  })

  addGherkinSyntax(monaco, expressions)
  addAutoComplete(monaco, index)

  return  editor => {
    const requestValidation = addDefinitionValidation(monaco, expressions)
    let validationTimeout
    // Add handler to check validation when the file content changes
    editor.onDidChangeModelContent(() => {
      clearTimeout(validationTimeout)
      validationTimeout = setTimeout(requestValidation, 500)
    })
  }
}
