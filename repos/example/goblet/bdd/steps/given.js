const { Given } = require('@GTU/Parkin')
const { getBrowserContext } = require('@GTU/Playwright')
const { getPage } = getBrowserContext()

Given('I navigate to {word}', async site => {
  const page = await getPage()
  await page.goto(site)
})
