/**
 * Waypoint Template
 * Waypoint files are wrapped in a Jest test function
 * This allows taking advantage of the Jest testing environment and pre-configured settings including
 *  - The `browser`, `context`, and `page` are all pre-configured and on the global scope
 *  - Simulated top-level await by wrapping the file content in an async function
 *  - Global access to `expect` via the global scope
 *
 * @example
 * await page.goto(`https://www.google.com`)
 * const inputLocator = await page.locator('[aria-label="Search"]')
 * await inputLocator.fill("goblet")
 * await page.keyboard.press("Enter")
 *
 */

