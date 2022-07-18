const { getPage } = require('@GTU/Playwright/browserContext')

/**
 * Helper methods for a locator list
 * Maybe better as helpers, but trying this out for now
 * Only sets the method if it does not already exist on the locators object
 * We don't own the Locators object, so this may be a bad idea
 */
const iterators = {
  map: async function (callback) {
    const count = await elements.count()
    const mapped = []
    for (let i = 0; i < count; ++i){
      const element = await elements.nth(i)
      const resp = callback(element, i)
      mapped.push(resp)
    }

    return mapped
  },
  forEach: async function (callback) {
    const count = await elements.count()
    for (let i = 0; i < count; ++i){
      const element = await elements.nth(i)
      callback(element, i)
    }
  },
  reduce: async function (callback, response) {
    const count = await elements.count()
    let acc = response
    for (let i = 0; i < count; ++i){
      const element = await elements.nth(i)
      acc = callback(acc, element, i)
    }
    return acc
  },
  evaluate: async function (callback) {
    return await elements.evaluateAll(callback)
  },
}

/**
 * Bind the locators iterators methods to the locators object
 * If the key already exists log a warning so we know it needs to be updated
 */
const addIterators = (elements) => {
  Object.entries(iterators).forEach(([key, method]) => {
    !elements[key]
      ? (elements[key] = method.bind(elements))
      : console.warn(`The Locators helper method ${key} already exists on the Locators object.`)
  })
  
  return elements
}

/**
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const getLocators = async (selector) => {
  const page = await getPage()
  const elements = await page.locator(selector)
  if (!elements) throw new Error(`The element with selector "${selector}" could not be found.`)

  return elements
  // return addIterators(elements)
  // return elements
}

module.exports = { getLocators }
