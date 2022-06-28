
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



module.exports = {
  cleanWorldPath,
  greaterLessEqual
}