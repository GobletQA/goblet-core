const { constants } = require('./constants')
const { CodeRunner } = require('./codeRunner')
const {noOp, checkCall, deepMerge, noOpObj} = require('@keg-hub/jsutils')

const PlayerInstances = {}

/**
 * @type Player
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
class Player {

  playing = false
  id = null
  onEvents = []
  page = undefined
  context = undefined
  browser = undefined
  onCleanup = noOp
  onCreateNewPage = undefined
  options = {}


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
    PlayerInstances[id] = PlayerInstances[id] || new Player(config, id)

    return PlayerInstances[id]
  }


  constructor(config, id) {
    this.id = id
    this.setupPlayer(config)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Recorder}
   * @type {function}
   * @param {Object} event - Data to be passed to the registered onEvent methods
   */
  fireEvent = (event) => {
    this.onEvents.map(func => checkCall(
      func,
      {...event, isPlaying: this.playing}
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
  setupPlayer = config => {
    const {
      page,
      repo,
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
    if(repo) this.repo = repo

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup
    if(onCreateNewPage) this.onCreateNewPage = onCreateNewPage

    return this
  }


  /**
   * Adds the init scripts to the browser context
   * Scripts allows simulating mouse movement
   * @member {Recorder}
   * @type {function}
   */
  addInitScripts = async () => {
    try {
      await this.page.exposeFunction(`isGobletPlaying`, this.onIsPlaying)
    }
    catch(err){
      // console.log(`------- Playing addInitScripts Error -------`)
      // console.error(err.stack)
    }
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Recorder}
   * @type {function}
   */
  start = async (startCof) => {
    const { url, ...config } = startCof

    try {
  
      if(this.playing){
        this.fireEvent({ name: constants.playError, message: 'Playing already inprogress' })
        console.warn('Playing already in progress, end it first')
        return this
      }

      this.playing = true
      this.setupPlayer(config)

      if(!this.page)
        throw new Error(`A Playwright page instance is required, but does not exist.`)

      await this.addInitScripts()
      const codeRunner = new CodeRunner(this)
      await codeRunner.run(this.options.activeFile.content)

      this.fireEvent({
        message: 'Playing started',
        name: constants.playStarted,
      })
    }
    catch(err){
      console.error(err.stack)
      
      await this.cleanUp(true)

      this.fireEvent({
        name: constants.playError,
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
  
      if(!this.context || !this.playing)
        this.fireEvent({
          name: constants.playError,
          message: 'Playing context does not exist'
        })

      // Turn off recording
      // Must be done before a new page is created
      // Ensure the injected scripts don't run
      this.playing = false

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
        name: constants.playEnded,
        message: 'Playing stopped',
      })

      await this.cleanUp(closeBrowser)
    }
    catch(err){
      console.error(err.stack)

      this.fireEvent({
        name: constants.playError,
        message: err.message,
      })
    }

    return this
  }

  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsPlaying = () => {
    return this.playing
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
    this.playing = false
    this.options = {}
    this.onEvents = []

  }
}

module.exports = {
  Player
}