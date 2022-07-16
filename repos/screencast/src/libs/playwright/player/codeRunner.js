// TODO( IMPORTANT ):  @lancetipton - Setup mv2
// const { NodeVM } = require('vm2')
const expect = require('expect')
const { getWorld } = require('@GTU/Support/world')
const { Parkin } = require('@ltipton/parkin')
const { ParkinTest } = require('@ltipton/parkin/test')
const { setParkinInstance } = require('@GTU/Parkin/instance')
const { getDefinitions } = require('@GSH/Repo/getDefinitions')

/**
 * Tiny-Jest allows calling the test methods directly
 * But it does not include a timeout / describe method
 * May need to replace, or extend it's functionality
 */

const setTestGlobals = (Runner) => {

  const PTE = new ParkinTest({
    specDone: Runner.onSpecDone,
    suiteDone: Runner.onSuiteDone,
    specStarted: Runner.onSpecStarted,
    suiteStarted: Runner.onSuiteStarted,
  })

  global.it = PTE.it
  global.xit = PTE.xit
  global.test = PTE.test
  global.xtest = PTE.xtest
  global.describe = PTE.describe
  global.xdescribe = PTE.xdescribe
  global.afterAll = PTE.afterAll
  global.afterEach = PTE.afterEach
  global.beforeAll = PTE.beforeAll
  global.beforeEach = PTE.beforeEach

  return PTE
}

const setupGlobals = (Runner) => {
  global.expect = expect.expect
  global.context = Runner.player.context
  return setTestGlobals(Runner)
}

const setupParkin = async (Runner) => {
  PK = Runner?.player?.repo?.parkin
  if(!PK) throw new Error(`Repo is missing a parkin instance`)

  await getDefinitions(Runner?.player?.repo)
  return PK
}


/**
 * CodeRunner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
class CodeRunner {

  /**
   * Player Class instance
   */
  player = undefined
  
  exec = undefined

  constructor(player) {
    this.player = player
    this.PTE = setupGlobals(this)
  }
  
  /**
   * Runs the code passed to it via the player
   */
  run = async (content) => {
    this.PK = await setupParkin(this)

    await this.PK.run(content)
    const results = await this.PTE.run()

    return results
  }

  onSpecDone = (...args) => {
    console.log(`------- onSpecDone -------`)
    console.log(...args)
    
  }
  
  onSuiteDone = (...args) => {
    console.log(`------- onSuiteDone -------`)
    console.log(...args)
    
  }
  
  onSpecStarted = (...args) => {
    console.log(`------- onSpecStarted -------`)
    console.log(...args)
    
  }
  
  onSuiteStarted = (...args) => {
    console.log(`------- onSuiteStarted -------`)
    console.log(...args)
    
  }

}

module.exports = {
  CodeRunner
}