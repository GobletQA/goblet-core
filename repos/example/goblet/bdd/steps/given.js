const { Given } = require('GobletParkin')
const { getBrowserContext } = require('GobletPWTestEnv')
const { getPage } = getBrowserContext()

Given('I navigate to {word}', async site => {
  const page = await getPage()
  await page.goto(site)
})
