const fs = require('fs')
const path = require('path')
const { constants } = require('./constants')
const {noOp, checkCall, deepMerge, noOpObj} = require('@keg-hub/jsutils')
const { EventsRecorder } = require('./eventsRecorder')
const injectedScript = fs.readFileSync(path.join(__dirname, 'inject/record.js')).toString()
const injectedMouseHelper = fs.readFileSync(path.join(__dirname, 'inject/mouseHelper.js')).toString()

const highlightStyles = {
  position: 'absolute',
  zIndex: '2147483640',
  background: '#f005',
  pointerEvents: 'none',
}

const RecorderInstances = {}

/**
 * @type Recorder
 * @property {string} id - Id of the recorder instants
 * @property {function[]} onEvents - Callback methods called when an event is fired
 * @property {Object} page - Playwright page instance
 * @property {Object} context - Playwright context instance
 * @property {Object} browser - Playwright browser instance
 * @property {function} onCleanup - Called when the cleanup / stop methods are called
 * @property {function} onCreateNewPage - Called when a new playwright page is created
 * @property {Object} options - Custom options used while recording
 * @property {Object} options.highlightStyles - Custom styles for the highlighter
 */
class Recorder {

  id = null
  onEvents = []
  page = undefined
  context = undefined
  browser = undefined
  onCleanup = noOp
  initialPageLoaded = false
  onCreateNewPage = undefined
  options = {highlightStyles}

  /**
   * Helper to keep track of all Recorder instances
   * Cached created instances based on Id
   * If the instance does not exist it will be created
   * @static
   * @type {function}
   * @param {string} id - Id to use when creating the recorder instance
   * @param {Object} config - Recorder config object
   */
  static getInstance = (id, config) => {
    RecorderInstances[id] = RecorderInstances[id] || new Recorder(config, id)

    return RecorderInstances[id]
  }

  constructor(config, id) {
    this.id = id
    this.setupRecorder(config)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Recorder}
   * @type {function}
   * @param {Object} event - Data to be passed to the registered onEvent methods
   */
  fireEvent = (event) => {
    if(event && (event.type === constants.recordAction)) EventsRecorder?.recordEvent(event)
  
    this.onEvents.map(func => checkCall(
      func,
      {...event, isRecording: this.recording}
    ))

    return this
  }

  /**
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Recorder}
   * @type {function}
   * @param {Object} config - Recorder config object
   */
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


  /**
   * Adds the init scripts to the browser context
   * Scripts allow capture dom events and simulating mouse movement
   * @member {Recorder}
   * @type {function}
   */
  addInitScripts = async () => {

    if(!this.context) 
      throw new Error(`A Playwright Browser Context is required, but does not exist`)

    if(this.initScriptsAdded)
      return console.warn(`Init scripts already added to recorder context`)

    try {
      // Inject the script that detects actions and highlights elements.
      this.initScriptsAdded = true
      // Would be better to add the scripts to the context
      // But the don't seem to be initializing for each page even though they should

      // Validate if this is needed
      // await this.page.addScriptTag({content: injectedScript})

      await this.page.exposeFunction(`isGobletRecording`, this.onIsRecording)
      await this.page.exposeFunction(`getGobletRecordOption`, this.onGetOption)
      await this.page.addInitScript({content: injectedScript})
      await this.page.addInitScript({content: injectedMouseHelper})
      
      // Create a binding to receive actions from the page.
      await this.page.exposeBinding('herkinRecordAction', this.onInjectedAction)

      //  Detect page loads.
      this.page.on('load', this.onPageLoad)

    }
    catch(err){
      /**
       * If the init Scripts were already added catch the error and just return
       */
      console.log(`------- addInitScript Error -------`)
      console.error(err.stack)
      // this.fireEvent({
      //   name: constants.recordError,
      //   message: err.message,
      // })
    }
    
    return this
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Recorder}
   * @type {function}
   */
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
        throw new Error(`A Playwright page instance is required, but does not exist.`)

      await this.addInitScripts()

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

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Recorder}
   * @type {function}
   */
  stop = async (closeBrowser) => {
    try {
  
      if(!this.context || !this.recording)
        this.fireEvent({
          name: constants.recordError,
          message: 'Recording context does not exist'
        })

      // Turn off recording
      // Must be done before a new page is created
      // Ensure the injected scripts don't run
      this.recording = false

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
        await this.onCreateNewPage(this.page, this)

        // Then  goto that page
        url && await this.page.goto(url)
      }

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
   * Allows passing options to the page when needed
   * Is called from within the browser context page
   * @param {string} optName - Name of the option to get
   */
  onGetOption = (optName) => {
    return this.options[optName]
  }

  /**
   * Called when a page loads to check if dom events should be capture
   * Is called from within the browser context
   */
  onIsRecording = () => {
    return this.recording
  }

  /**
   * Called when an event was detected by the injected script on the page.
   * @param {*} - Ignored
   * @param {Object} PageEvent - Events generated by the injected record script
   */
  onInjectedAction = (_, pageEvent) => {
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
          codeLineLength:  1,
          ...EventsRecorder.generator.codeFromEvent(pageEvent)
        },
        message: `User action ${pageEvent.type} recorded`,
      })
  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = async (page) => {
    const title = await page.title()
    const url = await page.url()

    this.fireEvent({
      message: 'page loaded',
      // TODO: add url and other metadata to data object
      data: {
        url,
        title,
        type: constants.pageload,
        ...EventsRecorder.generator.codeFromEvent({
          url,
          type: constants.pageload,
        })
      },
      name: constants.recordAction,
    })
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async (includeBrowser) => {
    await this.onCleanup(includeBrowser, this)

    includeBrowser &&
      this.browser &&
      await this.browser.close()

    delete this.page
    delete this.context
    delete this.browser
    this.recording = false
    this.options = {
      highlightStyles
    }
    this.onEvents = []

    if(this.id) delete RecorderInstances[this.id]
  }
}

module.exports = {
  Recorder
}