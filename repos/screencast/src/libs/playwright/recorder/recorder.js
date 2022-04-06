const fs = require('fs')
const path = require('path')
const {noOp, checkCall, deepMerge} = require('@keg-hub/jsutils')
const { EventsRecorder } = require('./eventsRecorder')

class Recorder {
  options = {}
  onEvents = []
  recordTag = `// <<CONTENT>>`


  constructor(config) {
    this.setupRecorder(config)
  }

  fireEvent = (...args) => {
    this.onEvents.map(func => checkCall(func, ...args))
  }

  setupRecorder = config => {
    const { activeFile, page, context, browser, onEvent=noOp, options } = config

    if(page) this.page = page
    if(context) this.context = context
    if(browser) this.browser = browser
    if(onEvent) this.onEvents.push(onEvent)
    if(activeFile) this.activeFile = activeFile
    if(options) this.options = deepMerge(this.options, options)
  }

  start = async ({ url, ...config }) => {
  
    if(this.recording)
      return console.warn('Recording already in progress, end it first')

    if(!this.activeFile)
      return console.warn(`Active file does not exit!`)

    this.recording = true
    this.setupRecorder(config)
    this.addRecordTag()

    this.fireEvent('RECORDING-STARTED')

    // Create a binding to receive actions from the page.
    await this.context.exposeBinding('herkinRecordAction', this.onInjectedAction)

    // Load the page.
    this.page = this.page || await this.context.newPage()
    url && await this.page.goto(url)

    // Inject the script that detects actions and highlights elements.
    const injectedScript = fs.readFileSync(path.join(__dirname, 'inject/record.js')).toString()
    await this.page.addScriptTag({content: injectedScript})
    await this.page.addInitScript({content: injectedScript})

    // Also detect page loads.
    this.page.on('load', this.onPageLoad)

    return true
  }

  stop = async (close) => {
    if(!this.context) return console.warn('No recording in progress to stop')

    this.fireEvent('RECORDING-STOPPED')

    const updatedFile = this.generateCode()
    this.page = null
    this.context = null
    this.browser = null
    this.activeFile = null
    this.recording = false
    this.onEvents = []

    this.fireEvent('UPDATED-FILE-CONTENT', updatedFile)
    return updatedFile
  }

  generateCode = () => {
    if (!this.activeFile)
      return console.warn(`Active file does not exit!`)

    const linesOfCode = EventsRecorder.getCode().map(line => '    ' + line)

    // TODO: replace the content in the file and save it
    return this.activeFile.replace(this.recordTag, linesOfCode.join('\n\n'))
  }

  addRecordTag = () => {
    if(this.activeFile.includes(this.recordTag))
      return console.log(`Record tag already exists in active file content`)

    const lines = this.activeFile.split(`\n`)
    const totalLines = lines.length
    const location = totalLines < this.options.line
      ? this.options.line
      : totalLines

    lines.splice(location, 0, this.recordTag)
    this.activeFile = lines.join(`\n`)
  }

  /**
   * Called when an event was detected by the injected script on the page.
   * @param source 
   * @param PageEvent 
   */
  onInjectedAction = (source, pageEvent) => {
    EventsRecorder?.recordEvent(pageEvent)
    // TODO: do something with the updated file
    // const updatedFile = this.generateCode()

  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = (...args) => {
    // TODO: @lance-tipton - this is not firing on initial page load
    EventsRecorder?.recordEvent({type: 'pageload'})
  }

}

module.exports = {
  Recorder
}