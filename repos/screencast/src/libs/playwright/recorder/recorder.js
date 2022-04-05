const fs = require('fs')
const path = require('path')
const {noOp} = require('@keg-hub/jsutils')
const { EventsRecorder } = require('./eventsRecorder')

class Recorder {
  
  constructor(config) {
    this.setBrowser(config)
  }

  setBrowser = ({ activeFile, page, context, browser, onEvent=noOp }) => {
    this.page = page
    this.context = context
    this.browser = browser 
    this.onEvent = onEvent
    activeFile && (this.activeFile = activeFile)
  }

  start = async ({ url, ...config }) => {
  
    if(this.recording)
      return console.warn('Recording already in progress, end it first')

    if(!this.activeFile)
      return console.warn(`Active file does not exit!`)

    this.recording = true
    this.setBrowser(config)

    this.onEvent('RECORDING-STARTED')

    // Create a binding to receive actions from the page.
    await this.context.exposeBinding('herkinRecordAction', this.onInjectedAction)

    // Load the page.
    this.page = this.page || await this.context.newPage()
    await this.page.goto(url)

    // Inject the script that detects actions and highlights elements.
    const injectedScript = fs.readFileSync(path.join(__dirname, './injectedScript'))
    await this.page.addScriptTag({content: injectedScript})
    await this.page.addInitScript({content: injectedScript})

    // Also detect page loads.
    this.page.on('load', this.onPageLoad)

    return true
  }

  stop = async (close) => {
    if(!this.context) return console.warn('No recording in progress to stop')

    this.onEvent('RECORDING-STOPPED')

    const updatedFile = this.generateCode()
    this.page = null
    this.context = null
    this.browser = null
    this.activeFile = null
    this.recording = false

    return updatedFile
  }

  generateCode = () => {
    if (!this.activeFile)
      return console.warn(`Active file does not exit!`)

    const linesOfCode = EventsRecorder.getCode().map(line => '    ' + line)

    // TODO: replace the content in the file and save it
    return this.activeFile.replace('    // <<CONTENT>>', linesOfCode.join('\n\n'))
  }

  /**
   * Called when an event was detected by the injected script on the page.
   * @param source 
   * @param PageEvent 
   */
  onInjectedAction = (source, pageEvent) => {
    EventsRecorder?.recordEvent(pageEvent)
  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = () => {
    EventsRecorder?.recordEvent({type: 'pageload'})
  }

}

module.exports = {
  Recorder
}