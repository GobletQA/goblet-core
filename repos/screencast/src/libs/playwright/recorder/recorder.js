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
    RecorderInstances[id] = RecorderInstances[id] || new Recorder(config, id)

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
    const {
      page,
      context,
      browser,
      options,
      onEvent=noOp,
      onCleanup=noOp,
      onCreateNewPage,
    } = config

    if(page) this.page = page
    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup
    if(onCreateNewPage) this.onCreateNewPage = onCreateNewPage

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

      if(!this.page)
        throw new Error(`A Playwright page instance is required, but not set.`)

      // Create a binding to receive actions from the page.
      await this.page.exposeBinding('herkinRecordAction', this.onInjectedAction)
      // Inject the script that detects actions and highlights elements.
      await this.page.addScriptTag({content: injectedScript})
      await this.page.addInitScript({content: injectedScript})
      //  Detect page loads.
      this.page.on('load', this.onPageLoad)

      url && await this.page.goto(url)

      this.fireEvent({
        message: 'Recording started',
        name: constants.recordStarted,
      })
    }
    catch(err){
      console.error(err.stack)
      
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
  
      if(!this.context || !this.recording)
        this.fireEvent({
          name: constants.recordError,
          message: 'Recording context does not exist'
        })

      // If there's a page
      // Get it's current url
      // Then close and reopen the page as a fresh instance
      // To simulate ending the recording process
      if(!closeBrowser && this.page){
        const url = this.page.url()
        this.page.close()
        this.page = undefined

        // Create a new page
        this.page = await this.context.newPage()
        console.log(`------- calling create new page -------`)
        await this.onCreateNewPage(this.page, this)

        // Then  goto that page
        url && await this.page.goto(url)
      }

      this.recording = false
      this.fireEvent({
        name: constants.recordEnded,
        message: 'Recording stopped',
      })

      await this.cleanUp(closeBrowser)
    }
    catch(err){
      console.error(err.stack)

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
  onPageLoad = async (page) => {
    const title = await page.title()

    this.fireEvent({
      message: 'page loaded',
      // TODO: add url and other metadata to data object
      data: {
        title,
        type: 'pageload',
        url: page.url(),
        // Not sure it we want to actually include the code for this
        // code: EventsRecorder.generator.codeFromEvent({ type: 'pageload' })
      },
      name: constants.recordAction,
    })
  }


  cleanUp = async (includeBrowser) => {
    await this.onCleanup(includeBrowser, this)

    includeBrowser &&
      this.browser &&
      await this.browser.close()

    delete this.page
    delete this.context
    delete this.browser
    this.recording = false
    this.options = {}
    this.onEvents = []

    if(this.id) delete RecorderInstances[this.id]
  }
}

module.exports = {
  Recorder
}