// TODO( IMPORTANT ):  @lancetipton - Setup mv2
// const { NodeVM } = require('vm2')
const expect = require('expect')
const { Parkin } = require('@ltipton/parkin')
const { ParkinTest } = require('@ltipton/parkin/test')
const { getWorld } = require('HerkinRepos/testUtils/support')
const { setParkinInstance } = require('HerkinParkin/instance')
const { getDefinitions } = require('HerkinSharedRepo/getDefinitions')

/**
 * Tiny-Jest allows calling the test methods directly
 * But it does not include a timeout / describe method
 * May need to replace, or extend it's functionality
 */
const { Test } = require('tiny-jest')

const setTestGlobals = (Runner) => {
  const file = Runner?.player?.options?.activeFile
  console.log(`------- file -------`)
  console.log(file)
  const PTE = new ParkinTest({
    
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
  const PK = new Parkin(Runner?.player?.repo?.world || getWorld())
  setParkinInstance(PK)
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

  constructor(player) {
    this.player = player
    this.tester = setupGlobals(this)
  }
  
  /**
   * Runs the code passed to it via the player
   */
  run = async (content) => {
    this.PK = await setupParkin(this)
    await this.PK.run(content)
    const results = await this.tester.run()
    
    console.log(`------- results -------`)
    console.log(results)


    return results
  }

  

}

module.exports = {
  CodeRunner
}