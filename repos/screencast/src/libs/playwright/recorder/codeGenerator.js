const { constants } = require('./constants')
const { noOpObj } = require('@keg-hub/jsutils')

class CodeGenerator {
  recorder = undefined

  constructor(recorder) {
    this.recorder = recorder
  }

  codeFromEvent = (event) => {
    switch (event.type) {
      case constants.click:
        return this.generateCodeForClickEvent(event)
      case constants.mousedown:
        return this.generateCodeForMouseDownEvent(event)
      case constants.mouseup:
        return this.generateCodeForMouseUpEvent(event)
      case constants.keypress:
        return this.generateCodeForKeyboardEvent(event)
      case constants.fill:
        return this.generateCodeForFillEvent(event)
      case constants.pageload:
        return this.generateCodeForPageLoadEvent(event)
      case constants.contentloaded:
        return this.generateCodeForContentLoadEvent(event)

      // Events to be implemented
      case constants.select:
        return this.generateCodeForSelectOptionEvent(event)
      case constants.pagereload:
        return this.generateCodeForPageReloadEvent(event)
      case constants.screenshot:
        return this.generateCodeForScreenshotEvent(event)
      case constants.route:
        return this.generateCodeForRouteEvent(event)
      case constants.pdf:
      case constants.print:
        return this.generateCodeForPrintEvent(event)
    }

    return noOpObj
  }


  generateCodeForPrintEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Maybe come from the Goblet UI
    // See https://playwright.dev/docs/api/class-page#page-pdf
    // return {code: `await page.pdf(${JSON.stringify(event.options)})`}
    return noOpObj
  }

  generateCodeForScreenshotEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Maybe come from the Goblet UI
    // See https://playwright.dev/docs/api/class-page#page-screenshot
    // return {code: `await page.screenshot(${JSON.stringify(event.options)})`}
    return noOpObj
  }

  generateCodeForRouteEvent = (event) => {
    // TODO: find a way to track this in the dom
    // See https://playwright.dev/docs/api/class-page#page-route
    // return {code: `await page.route('${url}', ${JSON.stringify(event.options)})`}
    return noOpObj
  }

  generateCodeForPageReloadEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Currently this will never be called, because we don't track select onchange events
    // See https://playwright.dev/docs/api/class-page#page-reload
    return {code: `await page.reload(${JSON.stringify(event.options)})`}
  }

  generateCodeForSelectOptionEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Currently this will never be called, because we don't track select onchange events
    // return {code: `await page.selectOption('${event.target}', '${event.value}')`}
    return noOpObj
  }

  generateCodeForClickEvent = (event) => {
    // Use click plus element type to change code to checkbox
    // page.check(event.target)
    // If event.checked === true, then call page.uncheck(event.target)
    // Or call page.setChecked(event.target, event.checked)
    return {code: `await page.click('${event.target}')`}
  }

  generateCodeForMouseDownEvent = (event) => {
    return {code: `await page.mouse.down('${event.target}')`}
  }

  generateCodeForMouseUpEvent = (event) => {
    return {code: `await page.mouse.up('${event.target}')`}
  }

  generateCodeForKeyboardEvent = (event) => {
    return {code: `await page.press('${event.target}', '${event.key}')`}
  }

  generateCodeForFillEvent = (event) => {
    // Possibly use page.type(event.target, event.value)
    // Depending on time between events
    return {code: `await page.fill('${event.target}', '${event.value}')`}
  }

  generateCodeForPageLoadEvent = (event) => {
    return {
      codeLineLength:  2,
      code: [
        `await page.goto('${event.url}')`,
        `await page.waitForLoadState('domcontentloaded')`
      ].join(`\n`),
    }
  }

  generateCodeForContentLoadEvent = (event) => {
    return {code: `await page.waitForLoadState('domcontentloaded')`}
  }

}


module.exports = {
  CodeGenerator
}