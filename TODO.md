# TODO


## Record
* Context menu
  * Displays when interacting with page, not in record mode
  * Allows copy to clipboard a selector for an element
  * Allows creating an alias to a selector
* Multi-selector select
  * Allows choosing which selector to use
  * Shows in context menu
  * Shows when option is toggled on
* Recording options menu
  * Set options when recording
* Pop-Over Component
  * Used by context menu
  * Used by MultiSelector Select
  * Used for Option screens
    * Record
    * Run Tests
    * Browser settings

## Screencast
* **Browser Server**
  * When starting server on boot, tests fail to run
    * Seems like there's an issue with the browser context being created when tests run
  * If the server is restarted, then tests work again, without changes
  * Must be an issue with how yarn screencast:daemon works
    * Anytime the server is started with the daemon, 
      * It tries to navigate to "https://playwright/index.html"
      * Looks like `yarn sc` also is not working
  * The only thing that seems to work is to run `yarn sc:restart`
    * After running that, everything works
* **TODO**
  * Validate if just restarting the server fixes the issue, or if all servers must be restarted
* **Possible Solution**
  * Don't start server on container run
    * Start when someone first visits the page
    * Then any interaction with the server should be fresh
* **Browser running but no metadata**
  * Add handling around a browser currently running, but no metadata exists
  * In this case, we should kill the running server, and restart it
### Investigate
* For all UI screencast, don't use Browser Server with websocket
  * Only needs to be used when running browser server on the host machine
  * This will make the Screencast UI work a lot faster
  * Will fix the problem with the browser server not connecting
    * Seems to only happen when used via websocket
  * Need to add code to check the if running with host websocket when creating a new browser



## UI Updates
* **Editor**
  * Allow multiple files open within an editor
  * Show tab for each open file
  * Clicking on tab switches to that file - Like a normal editor
* **Terminal**
  * Don't clear the terminal history 
  * Keep the history of each run, allow referring back to it
  * Allow text selection
* **Fix Definition/Definitions editors**
  * Have the definition editor show based on the selected step ( maybe? )
  * Allow selecting different steps to edit
  * Allow showing side-by-side or separately
* **Dialog Core step / integration**
  * [See playwrite docs here](https://playwright.dev/docs/api/class-dialog/)
  * Update herkin itself to set a `dialog` event listener
    * Handles browser window pop-ups
    * Must be called prior to tests being run
    * When the event is triggered by a dialog opening, save the dialog value to the world object
      * example: `page.on('dialog', dialog => (world.$dialog = dialog))`
  * In the step definition that needs to verify something about or control the dialog, it just needs to access the `world.$dialog` value
* **Page Layout**
  * Clean-up / fix the page-layout
  * Maybe a good idea to use a layout plugin / component-library
  * The Sections / Surfaces are inconsistent
    * In some cases scrollbars are shown, if others they are not
  * Target min-width of the Window is 1024px
    * All content should fit horizontally within this width
    * All sections should allow scrolling vertically
  * Issues
    * Definitions List
      * Content should wrap instead of show a horizontal scroll bar
    * Screencast
      * Should fit the height and width of the parent surface
      * Should not scroll in any direction
    * Terminal Test Output
      * Migrate into an Aside component that can be toggled on Screencast and Test Results Screens
    * Test Report
      * Should not Hoiozontal scroll
      * Should not have a max width larger than the parent surface
    * Slide-out menu 
      * Should allow vertical scrolling based on the content height
      * As items are opened/closed, the scroll height should adjust based on it's height



## Parkin
* **Fix Parking Optional Text parsing**
  * In some edge-cases the optional text is not parsed properly in Parkin
  * Which means the step is either not matched, or it throws an error
  * Example => 
      ```js
        Given('the {word} (titled) {string} is found', () => { /* ...do-something */ }, {
          // The following given line errors due to the optional word next to the expression. The error says that selectorAlias isn't a function. There is a ticket for this.
          // Given('the {word} (titled){string} is found', findElSetAsAncestor, {
            description: 'Locates an element by selector AND text.\nEstablishes the element as an ancestor for use by subsequent steps that reference a descendent element.\nThe word "titled" is optional depending on context.  See examples below for usage.\n\nModule : findElAsAncestor',
            expressions: []
        })
      ```
* **World Variables**
  * Update Parkin to check the step definition parameters for world variables (strings of form $world.*)
    * If a world variable is found, find its value in the world object
    * Take that value and pass it to the step definition function at the corresponding parameter index
    * Ensure that this works with string interpolation
    * Examples
      * Example 1
        * World => { app: { domain: 'www.test.com', query: `some-text` } }
        * Step Text => Given I navigate to"$world.app.domain/browse/sessions/?qString=$world.app.query&qString=2"
        * Definition Text => Given I navigate to {string}
        * Output => {string} converted to `www.test.com/browse/sessions/?qString=some-text&qString=2`
          * $world.app.domain && $world.app.query are replaced with values from the world object
      * Example 2
        * World => { appName: 'my-app' }
        * Step Text => And I click the element "material-button.icon > button[aria-label='View $world.appName']"
        * Definition Text => And I click the element {word}
        * Output => {word} converted to `material-button.icon > button[aria-label='View my-app']`

## Deployments
* **CI/CD**
  * Allows keg-herkin tests to be run in a CI/CD environment
  * Is possiable when screencast is complete
    * Allows running the browsers in the docker image and headless
* **Deploy as a docker image**
  * Stand up on a server somewhere
  * Is possiable when screencast is complete
    * Uses screencast to display browser
      * Only works with chrome and firefox
      * Might work with IE, but needs to be validated

## Admin
* **Integrate Goblet-Admin**
  * ...


## Idea
  * Parse cmd output to know what test is currently running
  * On the right side of the screencast, show list of tests
    * Use the parsed cmd output to highlight which test is currently running
    * Update it as it runs to be pass / fail / error etc...


## Step config options
* Add ability to configure options on a per-step basis
### Examples
* waitFor
  * state - One of attached, detached, visible, hidden
  * timeout - in seconds, defaults to 30 seconds

## For saving browser context
Generate context
* Allow creating a feature file the runs in the setup test environment
* It can then save the context which can be reused in the tests
* Allow setting option to use browser with context