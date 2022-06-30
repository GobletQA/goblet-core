const os = require('os')
const path = require('path')
const { get } = require('@keg-hub/jsutils')
const { getLocator } = require('HerkinPlaywright')

const checkTypes = {
  less: {
    match: [`less`, `<`],
    method: (val, count) => {
      console.log(`Expect ${val} to be less-then ${count}`)
      expect(val < count).toEqual(true)
    }
  },
  greater: {
    match: [`greater`, `>`],
    method: (val, count) => {
      console.log(`Expect ${val} to be greater-then ${count}`)
      expect(val > count).toEqual(true)
    }
  },
  equal: {
    match: [ `equal`, `=`, `==`, `===`],
    method: (val, count) => {
      console.log(`Expect ${val} to be equal to ${count}`)
      expect(val === count).toEqual(true)
    }
  },
  lessEqual: {
    match: [`less-equal`, `<=`],
    method: (val, count) => {
      console.log(`Expect ${val} to be less-then or equal to ${count}`)
      expect(val <= count).toEqual(true)
    }
  },
  greaterEqual: {
    match: [`greater-equal`, `>=`],
    method: (val, count) => {
      console.log(`Expect ${val} to be greater-then or equal to ${count}`)
      expect(val >= count).toEqual(true)
    }
  }
}

const compareTypes = [
  `contains`,
  `matches`
] 

/**
 * Gets the storage location from the temp-directory
 */
const contextStateLoc = (saveLocation) => {
  const tempDir = os.tmpdir()
  const location = `${saveLocation.split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
const saveContextState = async (context, location) => {
  return await context.storageState({ path: contextStateLoc(location) })
}


/**
 * Expects the number of dom elements matching `selector` to match `count` based on the comparison screen
 * @param {string} selector - valid playwright selector
 * @param {number} count - expected number of selectors in the DOM
 */
const greaterLessEqual = (count1, count2, type) => {
  const foundType = Object.entries(checkTypes)
    .find(([key, def]) => def.match.includes(type))
  
  if(!foundType)
    throw new Error(`Invalid type. Must be one of ${greaterLessEqual.matchTypes}`)

  foundType[1].method(count1, count2)
}
greaterLessEqual.matchTypes = Object.entries(checkTypes)
  .reduce((types, [key, def]) => {
    types.push(...def.match)
    return types
  }, [])
  .join(', ')

/**
 * Cleans the passed in world path to ensure world || $world is not the start of the string
 * @param {string} worldPath - Path on the world object
 *
 * @return {string} - Cleaned world path
 */
const cleanWorldPath = (worldPath) => {

  const pathArr = worldPath.trim().split(`.`).filter(part => Boolean(part.trim()))
  const noWorld = pathArr[0] === '$world' || pathArr[0] === 'world' ? pathArr.slice(1) : pathArr

  return noWorld.filter(Boolean).join('.').trim()
}


/**
 * Gets the data from the passed in world path and world object 
 * @param {string} worldPath - Path on the world object
 * @param {object} world - Global world object
 * @param {*} fallback - Value to use if world value does not exit
 *
 * @return {*} - Data that exist on the world object at the passed in worldPath
 */
const getWorldData = (worldPath, world, fallback) => {
  const cleaned = cleanWorldPath(worldPath)
  if(!cleaned) throw new Error(`World Path "$world.${worldPath}" is invalid.`)

  const saved = get(world, cleaned, fallback)
  if(saved === undefined) throw new Error(`Saved value "$world.${worldPath}" does not exist.`)

  return saved
}

/**
 * Compares the content of two values, either contains or exact matching 
 * @param {*} val1 - First value to compare
 * @param {*} val2 - Value to compare against
 * @param {string} type - Type of comparison to do
 *
 * @return {void}
 */
const compareValues = (val1, val2, type) => {
  if(!compareTypes.includes(type))
    throw new Error(`Compare type "${type}" is invalid. Must be one of "${compareTypes.join(', ')}".`)

  type === `contains`
    ? expect(val1).toEqual(expect.stringContaining(val2))
    : expect(val1).toEqual(val2)
}

/**
 * Finds the locator by selecotr
 * @param {*} val1 - First value to compare
 * @param {*} val2 - Value to compare against
 * @param {string} type - Type of comparison to do
 *
 * @return {void}
 */
const callLocatorMethod = async (selector, prop, locator) => {
  const element = locator || await getLocator(selector)
  if(!element[prop])
    throw new Error(`Selected Element ${selector} missing prop method "${prop}".`)

  return await element[prop]()
}

const getLocatorAttribute = async (selector, attr, locator) => {
  const element = locator || await getLocator(selector)


  return await element.getAttribute(attr)
}

const getLocatorProps = async (selector, locator) => {
  const element = locator || await getLocator(selector)

  // TODO: Add more properties to the returned object
  return await element.evaluate(el => ({
    value: el.value,
    tagName: el.tagName,
    className: el.className,
    textContent: el.textContent,
  }))
}

const getLocatorTagName = async (selector, locator) => {
  const element = locator || await getLocator(selector)
  return await element.evaluate(el => el.tagName)
}

const getLocatorContent = async (selector, locator) => {
  const element = locator || await getLocator(selector)
  const tagName = await getLocatorTagName(selector, element)

  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
    ? await element.inputValue()
    : await element.textContent()
}


module.exports = {
  saveContextState,
  contextStateLoc,
  getWorldData,
  compareValues,
  callLocatorMethod,
  getLocatorAttribute,
  cleanWorldPath,
  greaterLessEqual,
  getLocatorProps,
  getLocatorTagName,
  getLocatorContent,
}