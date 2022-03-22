const { Given } = require('HerkinParkin')
const { getBrowserContext } = require('HerkinTestEnv')
const { getPage } = getBrowserContext()

Given('I navigate to {word}', async site => {
  const page = await getPage()
  await page.goto(site)
})
