const fs = require('fs')
const path = require('path')
const { constants } = require('./constants')
const {noOp, checkCall, deepMerge, noOpObj} = require('@keg-hub/jsutils')
const { EventsRecorder } = require('./eventsRecorder')
const injectedScript = fs.readFileSync(path.join(__dirname, 'inject/record.js')).toString()

const RecorderInstances = {}

class Recorder {
  id = null
  options = {}
  onEvents = []

  static getInstance = (id, config) => {
    if(RecorderInstances[id]) return RecorderInstances[id]
    
    RecorderInstances[id] = new Recorder(config, id)

    return RecorderInstances[id]
  }

  constructor(config, id) {
    this.id = id
    this.setupRecorder(config)
  }

  fireEvent = (event) => {
    if(event && (event.type === constants.recordAction)) EventsRecorder?.recordEvent(event)
  
    this.onEvents.map(func => checkCall(
      func,
      {...event, isRecording: this.recording}
    ))

    return this
  }

  setupRecorder = config => {
    const { page, context, browser, options, onEvent=noOp, onCleanup=noOp } = config

    if(page) this.page = page
    if(context) this.context = context
    if(browser) this.browser = browser
    if(onEvent) this.onEvents.push(onEvent)
    if(options) this.options = deepMerge(this.options, options)

    this.onCleanup = onCleanup

    return this
  }

  start = async ({ url, ...config }) => {
    try {
      if(this.recording){
        this.fireEvent({ name: constants.recordError, message: 'Recording already inprogress' })
        console.warn('Recording already in progress, end it first')
        return this
      }

      this.recording = true
      this.setupRecorder(config)

      // Create a binding to receive actions from the page.
      await this.context.exposeBinding('herkinRecordAction', this.onInjectedAction)

      // Load the page.
      this.page = this.page || await this.context.newPage()
      url && await this.page.goto(url)

      // Inject the script that detects actions and highlights elements.
      await this.page.addScriptTag({content: injectedScript})
      await this.page.addInitScript({content: injectedScript})

      // Also detect page loads.
      this.page.on('load', this.onPageLoad)

      this.fireEvent({
        message: 'Recording started',
        name: constants.recordStarted,
      })
    }
    catch(err){
      await this.cleanUp(true)

      this.fireEvent({
        name: constants.recordError,
        message: err.message,
      })
    }

    return this
  }

  stop = async (closeBrowser) => {

    try {
  
      if(!this.context || !this.recording){
        this.fireEvent({
          name: constants.recordError,
          message: 'Recording context does not exist'
        })
      }

      await this.cleanUp(closeBrowser)

      // If there's a page
      // Get it's current url
      // Then close and reopen the page as a fresh instance
      // To simulate ending the recording process
      if(!closeBrowser && this.page){
        const url = this.page.url()
        this.page.close()
        // Create a new page
        const page = await this.context.newPage()
        // Then  goto that page
        url && await page.goto(url)
      }

      this.fireEvent({
        name: constants.recordEnded,
        message: 'Recording stopped',
      })
    }
    catch(err){
      this.fireEvent({
        name: constants.recordError,
        message: err.message,
      })
    }
    
    return this
  }

  /**
   * Called when an event was detected by the injected script on the page.
   * @param source 
   * @param PageEvent 
   */
  onInjectedAction = (source, pageEvent) => {
    const fireEvent = this.fireEvent.bind(this)
    const noKeypress = EventsRecorder.checkFillSequence(pageEvent, fireEvent)
    const noClick = noKeypress && EventsRecorder.checkClickSequence(pageEvent, fireEvent)

    // TODO: @lance-tipton - Add other event listeners 
    // Delete on input not being tracked
    // Dragging, focus, blur, all need to be added
    noClick &&
      this.fireEvent({
        name: constants.recordAction,
        data: {
          ...pageEvent,
          code: EventsRecorder.generator.codeFromEvent(pageEvent)
        },
        message: `User action ${pageEvent.type} recorded`,
      })
  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = (...args) => {
    this.fireEvent({
      message: 'page loaded',
      // TODO: add url and other metadata to data object
      data: {},
      name: constants.recordAction,
    })
  }


  cleanupBrowser = async () => {
    try {
      // Only close the browser if the arg passed is true
      // Otherwise we can make the browser reusable
      // And we don't have to create a new one 
      this.page && await this.page.close()
      this.context && await this.context.close()
      this.browser && await this.browser.close()
    }
    catch(err){
      this.fireEvent({
        name: constants.recordError,
        message: err.message,
      })
    }

    delete this.page
    delete this.context
    delete this.browser

    return this
  }

  cleanUp = async (closeBrowser) => {
    await this.onCleanup(closeBrowser, this)

    closeBrowser && await this.cleanupBrowser()

    this.recording = false
    this.options = {}
    this.onEvents = []
    if(this.id) delete RecorderInstances[this.id]
  }
}

module.exports = {
  Recorder
}