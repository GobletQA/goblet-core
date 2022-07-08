
/**
 * All modifier keys to be added to tracked events when active
 * @type {Array}
 */
const modifierKeys = [
  'altKey',
  'ctrlKey',
  'metaKey',
  'shiftKey'
]

/**
 * All position values to be added to tracked events 
 * @type {Array}
 */
const eventCoords = [
  'offsetX',
  'offsetY',
  'pageX',
  'pageY',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
]

/**
 * Cache holder for the element that highlights elements in the dome
 * Listens to the mousemove event
 * @type {Object}
 */
let highlightEl

/**
 * All sides of a rect to set the highlightEl size
 * @type {Array}
 */
const sides = ['top', 'left', 'width', 'height']

/**
 * All dom events that are listened to and capture in the Recorder
 * @type {Array}
 */
const actions = [
 'mousedown',
 'mouseup',
 'click',
 'keypress',
 'scroll',
 'cut',
 'copy',
 'paste',
 'pointerout',
 'pointerover',
]

/**
 * Helper to check if a value exists
 * @type {Function}
 * @param {*} value - To be checked if it exists
 *
 */
const exists = (value) => {
  return (value !== undefined && value !== null && !Number.isNaN(value))
}

/**
 * Helper to lookup items in a names array and see if they exists on the passed in element
 * @type {Function}
 * @param {Object} e - Dom element to check against
 * @param {Array} names - Array of keys to check
 * @param {boolean} checkExists - True if should check if the values exists to falsy values are included
 *
 */
const loopKeyNames = (e, names, checkExists) => {
  return names.reduce((acc, name) => {
    if(checkExists && exists(e[name]) || e[name]){
      if(!acc) acc = {}
      acc[name] = e[name]
    }

    return acc
  }, false)
}


/**
 * Checks if the element is visitable on the page 
 * Uses the passed in event to create the required metadata
 * @type {Function}
 * @param {Object} e - Dom event fired from an event listener
 *
 */
const isVisible = (element, computedStyle) => {
  return (element.offsetWidth <= 0 || element.offsetHeight <= 0) ||
    (computedStyle && computedStyle.visibility === "hidden") ||
    (computedStyle && computedStyle.display === "none")
    ? false
    : true
}

/**
 * Helper to build the event data that's passed from the browser back to playwright
 * Uses the passed in event to create the required metadata
 * @type {Function}
 * @param {Object} e - Dom event fired from an event listener
 *
 */
const buildEvent = (e, disableClick=true) => {

  if(e.type === 'click' && disableClick){
    // Only capture first mouse button. Ignore right clicks
    if (e.button !== 0 || !e.isTrusted || !isVisible(e.target)) return

    // TODO: @lance-tipton - Add options to enable/disable when recording
    e.stopPropagation()
    e.preventDefault()
  }

  const event = {
    key: e.key,
    type: e.type,
    target: window.findCssSelector(e.target),
  }

  if(e.type === 'keypress') event.value = e.target.value + (e.key && e.key.length === 1 ? e.key : '')
  else if(exists(e.target.value)) event.value = e.target.value

  if(exists(e.target.type)) event.elementType = e.target.type
  if(exists(e.target.tagName)) event.elementTag = e.target.tagName.toLowerCase()

  if(event.elementType === 'checkbox' || event.elementType === 'radio')
    event.elementChecked = e.target.checked
  
  if(event.elementType === 'select'){
    event.selectedIndex = e.target.selectedIndex
    event.selectedText = e.target[event.selectedIndex].text
  }

  if(exists(e.dataTransfer)) event.dataTransfer = dataTransfer

  const modifiers = loopKeyNames(e, modifierKeys)
  if(modifiers) event.modifiers = modifiers

  const coords = loopKeyNames(e, eventCoords, true)
  if(coords) event.coords = coords

  if(typeof window !== 'undefined' && window.__gobletTest){
    event.element = e.target
  }

  return event
}

/**
 * Highlights the element on the dom that is currently hovered by the mouse pointer
 * Listens to the mousemove event
 * @param {Object} e - Dom event fired from an event listener
 */
const hoverHighlighter = (e, styles) => {
  if (!highlightEl) {
    highlightEl = document.createElement('div')
    Object.keys(styles).forEach(key => highlightEl.style[key] = styles[key])
    document.body.appendChild(highlightEl)
  }
  const rect = e.target.getBoundingClientRect()
  sides.forEach(side => highlightEl.style[side] = rect[side] + 'px')
}

/**
 * Init script that checks if the script should run based on recording state
 */
const initGobletRecording = async () => {
  /**
   * Check if the browser events should be recorder
   * Calls a globally injected script via playwright
   */
  const isRecording = await window.isGobletRecording()
  if(!isRecording) return

  /**
   * Get the custom styles for the highlight element
   */
  const styles = await window.getGobletRecordOption('highlightStyles')

  /**
   * Listen to mousemove to allow updating the highlightEl
   */
  window.addEventListener('mousemove', e => hoverHighlighter(e, styles))

  /**
   * Get the value for disabling clicks
   */
  const disableClick = await window.getGobletRecordOption('disableClick')

  /**
   * Helper to build the event data that's passed from the browser back to playwright
   * Uses the passed in event to create the required metadata
   */
  actions.forEach((action) => window.addEventListener(
    action,
    e => window.gobletRecordAction(buildEvent(e, disableClick))
  ))
}


initGobletRecording()
