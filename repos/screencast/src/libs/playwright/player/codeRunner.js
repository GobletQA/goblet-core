const { NodeVM } = require('vm2')
// const { Parkin } = require('@ltipton/parkin')
const { setParkinInstance } = require('HerkinParkin/instance')
const { getWorld } = require('HerkinRepos/testUtils/support')
const { getDefinitions } = require('HerkinSharedRepo/getDefinitions')


// TODO - @lance-tipton Add proper globals for test methods
// Load step definitions for environment
// Right now re-using definitions loaded from backend - Which is very bad
const setupGlobals = (Runner) => {
  global.context = Runner.player.context

  global.beforeAll = global.beforeAll || (async (callback, ...args) => {
    console.log(`------- beforeAll -------`)
    return await callback()
  })
  global.afterAll = global.afterAll || (async (callback, ...args) => {
    console.log(`------- afterAll -------`)
    return await callback()
  })
  global.beforeEach = global.beforeEach || (async (callback, ...args) => {
    console.log(`------- beforeEach -------`)
    return await callback()
  })
  global.afterEach = global.afterEach || (async (callback, ...args) => {
    console.log(`------- afterEach -------`)
    return await callback()
  })
  global.describe = global.describe || (async (description, callback) => {
    console.log(`------- describe - ${description} -------`)
    return await callback()
  })
  global.test = global.test || (async (description, callback) => {
    // const defs = parkin.steps.list()

    console.log(`------- test - ${description} -------`)
    return await callback()
  })
}


const setupParkin = async (Runner) => {
  const PK = new Parkin(Runner?.player?.repo?.world || getWorld())
  setParkinInstance(PK)
  await getDefinitions(Runner?.player?.repo)

  return PK
}

class CodeRunner {

  /**
   * Player Class instance
   */
  player = undefined


  constructor(player) {
    this.player = player
    setupGlobals(this)
    this.PK = setupParkin(this)
  }
  
  /**
   * Runs the code passed to it via the player
   */
  run = async (content) => {
    const resp = await this.PK.run(content)
    console.log(`------- resp -------`)
    console.log(resp)
  }
  
}

module.exports = {
  CodeRunner
}