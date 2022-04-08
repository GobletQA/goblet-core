const fs = require('fs')
const path = require('path')
const {noOp, checkCall, deepMerge, noOpObj} = require('@keg-hub/jsutils')
const { EventsRecorder } = require('./eventsRecorder')

const RecorderInstances = []

class Recorder {
  id = null
  options = {}
  onEvents = []
  recordTag = `// <<CONTENT>>`
  trackEvents = []
  lastEvent = {}

  static getInstance = (id, config) => {
    if(RecorderInstances[id]) return RecorderInstances[id]
    
    RecorderInstances[id] = new Recorder(config, id)

    return RecorderInstances[id]
  }

  constructor(config, id) {
    this.id = id
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

    this.fireEvent({ type: 'RECORD-GENERAL', message: 'Recording started' })

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

    this.fireEvent({ type: 'RECORD-GENERAL',  message: 'Recording stopped' })

    // Since events are tracked in real time this should not be needed
    const updatedFile = this.generateCode()

    this.page = null
    this.context = null
    this.browser = null
    this.activeFile = null
    this.recording = false
    this.onEvents = []
    this.fireEvent({message: 'Updated file content', data: updatedFile})

    delete RecorderInstances[id]

    return updatedFile
  }

  generateCode = () => {
    if (!this.activeFile)
      return console.warn(`Active file does not exit!`)

    const linesOfCode = EventsRecorder.getCode()
    // .map(line => '    ' + line)

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
    const noKeypress = EventsRecorder.checkFillSequence(pageEvent, this.fireEvent.bind(this))
    const noClick = noKeypress && EventsRecorder.checkClickSequence(pageEvent, this.fireEvent.bind(this))

    // TODO: @lance-tipton - Add other event listeners 
    // Delete on input not being tracked
    // Dragging, focus, blur, all need to be added

    noClick &&
      this.fireEvent({
        type: 'RECORD-ACTION',
        data: {
          ...pageEvent,
          code: EventsRecorder.generator.codeFromEvent(pageEvent)
        },
        message: `${pageEvent.type} action recorded`,
      })
  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = (...args) => {
    this.fireEvent({ message: 'page loaded' })
    // TODO: @lance-tipton - this is not firing on initial page load
    EventsRecorder?.recordEvent({type: 'pageload'})
  }

}

module.exports = {
  Recorder
}