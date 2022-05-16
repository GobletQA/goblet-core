/**
 * Finds the position of an element within a list of element
 * Uses shortcuts where possible through the element.id or element tagName
 * Otherwise it will try to generate a selector from the element classList and tagName
 * @type {Function}
 * @param {Object} el - Dom element to generate a selector for
 * @param {Array} nodeList - List of dom nodes that may contain the element
 *
 */
const positionInNodeList = (el, nodeList) => {
  for (let i = 0; i < nodeList.length; i++) {
    if (el === nodeList[i]) return i
  }

  return -1
}

const searchUpDomTree = (el, doc, selector) => {

  // Check unique with just the selector
  let matches = doc.querySelectorAll(selector)
  if (matches.length === 1) return selector

  // Check unique with a tag name and selector
  const tagSelector = CSS.escape(el.tagName) + selector
  matches = doc.querySelectorAll(tagSelector)
  if (matches.length === 1) return tagSelector

  // Find the selector for the parent
  const parentSelector = findCssSelector(el.parentNode)
  if(!parentSelector) return undefined

  // Check unique with parent and selector
  const wPSelector = parentSelector + " > " + selector
  matches = doc.querySelectorAll(wPSelector)
  if (matches.length === 1) return wPSelector

  // Check unique with parent and tag + selector
  const wPTSelector = parentSelector + " > " + tagSelector
  matches = doc.querySelectorAll(wPTSelector)
  if (matches.length === 1) return wPTSelector

}

const uniqueByNth = (el, doc) => {
  // Check unique with tag name and nth-child
  const index = positionInNodeList(el, el.parentNode.children) + 1
  const nChildSelector = CSS.escape(el.tagName) + ":nth-child(" + index + ")"

  return el.parentNode === doc || doc.querySelectorAll(nChildSelector).length === 1
    ? nChildSelector
    : searchUpDomTree(el, doc, nChildSelector)
}

const uniqueByDataAttribute = (el, doc) => {
  return el.getAttributeNames().reduce((found, name) => {
    if (!name.startsWith('data-'))  return found

    const val = el.getAttribute(name)
    const attr = val
      ? name + '="' + el.getAttribute(name) + '"'
      : name

    return searchUpDomTree(el, doc, el.localName + '[' + attr + ']')

  }, undefined)
}

const uniqueByTag = (tag) => {
  return (['html', 'head', 'body']).find(item => item === tag)
}

const uniqueById = (el, doc) => {
  const id = el.id && CSS.escape(el.id)
  if(!id) return undefined

  return searchUpDomTree(el, doc, '#' + id)
}

const buildClassSelector = (className) => {
  return "." + CSS.escape(className)
}

const uniqueByClassName = (el, doc) => {
  // Check if the className unique on the page
  // If no id, try to generate a selector from it's classList and tagName
  for (let i = 0; i < el.classList.length; i++) {
    const found = searchUpDomTree(el, doc, buildClassSelector(el.classList.item(i)))
    if(found) return found
  }
}


/**
 * Tries to generate a unique selector for the passed in element
 * Uses shortcuts where possible through the element.id or element tagName
 * Otherwise it will try to generate a selector from the element classList and tagName
 * @type {Function}
 * @param {Object} el - Dom element to generate a selector for
 *
 */
const findCssSelector = (el) => {
  const doc = el.ownerDocument

  const idSelector = uniqueById(el, doc)
  if(idSelector) return idSelector

  const classSelector = uniqueByClassName(el, doc)
  if(classSelector) return classSelector

  const dataSelector = uniqueByDataAttribute(el, doc)
  if(dataSelector) return dataSelector

  const tagSelector = uniqueByTag(el.localName, doc)  
  if(tagSelector) return tagSelector

  const nthSelector = uniqueByNth(el, doc)
  if(nthSelector) return nthSelector

}

if(typeof window !== 'undefined'){
  window.findCssSelector = findCssSelector

  window.__gobletTest && (
    window.__gobletTest.selector = {
      uniqueById: uniqueById,
      uniqueByTag: uniqueByTag,
      findCssSelector: findCssSelector,
      uniqueByClassName: uniqueByClassName,
    }
  )

}
