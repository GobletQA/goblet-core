
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
 * Helper to check if a value exists
 * @type {Function}
 * @param {*} value - To be checked if it exists
 *
 */
function exists(value){
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
function loopKeyNames (e, names, checkExists) {
  return names.reduce(function(acc, name) {
    if(checkExists && exists(e[name]) || e[name]){
      if(!acc) acc = {}
      acc[name] = e[name]
    }

    return acc
  }, false)
}


/**
 * Finds the position of an element within a list of element
 * Uses shortcuts where possible through the element.id or element tagName
 * Otherwise it will try to generate a selector from the element classList and tagName
 * @type {Function}
 * @param {Object} el - Dom element to generate a selector for
 * @param {Array} nodeList - List of dom nodes that may contain the element
 *
 */
function positionInNodeList(el, nodeList) {
  for (let i = 0; i < nodeList.length; i++) {
    if (el === nodeList[i]) return i
  }

  return -1
}

/**
 * Tries to generate a unique selector for the passed in element
 * Uses shortcuts where possible through the element.id or element tagName
 * Otherwise it will try to generate a selector from the element classList and tagName
 * @type {Function}
 * @param {Object} el - Dom element to generate a selector for
 *
 */
function findCssSelector(el) {
  const doc = el.ownerDocument

  // If it's got an id, and no other elements have the same id, use it
  if (el.id && doc.querySelectorAll("#" + CSS.escape(el.id)).length === 1)
    return "#" + CSS.escape(el.id)

  // Inherently unique by tag name
  const tagName = el.localName

  if (tagName === "html")
    return "html"
  if (tagName === "head")
    return "head"
  if (tagName === "body")
    return "body"

  // If no id, try to generate a selector from it's classList and tagName
  let selector
  let index
  let matches

  for (let i = 0; i < el.classList.length; i++) {

    // Check if the className unique on the page
    selector = "." + CSS.escape(el.classList.item(i))
    matches = doc.querySelectorAll(selector)
    if (matches.length === 1) return selector

    // Check unique with a tag name only
    selector = CSS.escape(tagName) + selector
    matches = doc.querySelectorAll(selector)
    if (matches.length === 1) return selector

    // Check unique with tag name and nth-child
    index = positionInNodeList(el, el.parentNode.children) + 1
    selector = selector + ":nth-child(" + index + ")"
    matches = doc.querySelectorAll(selector)
    if (matches.length === 1) return selector

  }

  // Validate if it's unique relative to all other dom nodes
  index = positionInNodeList(el, el.parentNode.children) + 1
  selector = CSS.escape(tagName) + ":nth-child(" + index + ")"

  if (el.parentNode !== doc)
    selector = findCssSelector(el.parentNode) + " > " + selector

  return selector
}


/**
 * Helper to build the event data that's passed from the browser back to playwright
 * Uses the passed in event to create the required metadata
 * @type {Function}
 * @param {Object} e - Dom event fired from an event listener
 *
 */
function buildEvent(e) {
  
  // TODO: this needs more investigation
  if(e.type === 'click'){
    e.stopPropagation()
    e.preventDefault()
  }

  const event = {
    key: e.key,
    type: e.type,
    target: findCssSelector(e.target),
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

  return event
}

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
 * Highlights the element on the dom that is currently hovered by the mouse pointer
 * Listens to the mousemove event
 * @param {Object} e - Dom event fired from an event listener
 */
function hoverHighlighter(e) {
  if (!highlightEl) {
    highlightEl = document.createElement('div')
    highlightEl.style.position = 'absolute'
    highlightEl.style.zIndex = '2147483640'
    highlightEl.style.background = '#f005'
    highlightEl.style.pointerEvents = 'none'
    document.body.appendChild(highlightEl)
  }
  const rect = e.target.getBoundingClientRect()
  sides.forEach(side => highlightEl.style[side] = rect[side] + 'px')
}

/**
 * Listen to mousemove to allow updating the highlightEl
 */
window.addEventListener('mousemove', e => hoverHighlighter(e))

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
 * Helper to build the event data that's passed from the browser back to playwright
 * Uses the passed in event to create the required metadata
 */
actions.forEach((action) => window.addEventListener(action, e => window.herkinRecordAction(buildEvent(e))))


