class CodeGenerator {
  recorder = undefined

  constructor(recorder) {
    this.recorder = recorder
  }

  codeFromEvent = (event) => {
    switch (event.type) {
      case 'click':
        return this.generateCodeForClickEvent(event)
      case 'mousedown':
        return this.generateCodeForMouseDownEvent(event)
      case 'mouseup':
        return this.generateCodeForMouseUpEvent(event)
      case 'keypress':
        return this.generateCodeForKeyboardEvent(event)
      case 'fill':
        return this.generateCodeForFillEvent(event)
      case 'pageload':
        return this.generateCodeForPageLoadEvent(event)

      // Events to be implemented
      case 'select':
        return this.generateCodeForSelectOptionEvent(event)
      case 'pagereload':
        return this.generateCodeForPageReloadEvent(event)
      case 'screenshot':
        return this.generateCodeForScreenshotEvent(event)
      case 'route':
        return this.generateCodeForRouteEvent(event)
      case 'pdf':
      case 'print':
        return this.generateCodeForPrintEvent(event)
    }

    return ''
  }


  generateCodeForPrintEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Maybe come from the Herkin UI
    // See https://playwright.dev/docs/api/class-page#page-pdf
    // return `await page.pdf(${JSON.stringify(event.options)})`
    return ``
  }

  generateCodeForScreenshotEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Maybe come from the Herkin UI
    // See https://playwright.dev/docs/api/class-page#page-screenshot
    // return `await page.screenshot(${JSON.stringify(event.options)})`
    return ``
  }

  generateCodeForRouteEvent = (event) => {
    // TODO: find a way to track this in the dom
    // See https://playwright.dev/docs/api/class-page#page-route
    // return `await page.route('${url}', ${JSON.stringify(event.options)})`
    return ``
  }

  generateCodeForPageReloadEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Currently this will never be called, because we don't track select onchange events
    // See https://playwright.dev/docs/api/class-page#page-reload
    // return `await page.reload(${JSON.stringify(event.options)})`
    return ``
  }

  generateCodeForSelectOptionEvent = (event) => {
    // TODO: find a way to track this in the dom
    // Currently this will never be called, because we don't track select onchange events
    // return `await page.selectOption('${event.target}', '${event.value}')`
    return ``
  }

  generateCodeForClickEvent = (event) => {
    // Use click plus element type to change code to checkbox
    // page.check(event.target)
    // If event.checked === true, then call page.uncheck(event.target)
    // Or call page.setChecked(event.target, event.checked)
    return `await page.click('${event.target}')`
  }

  generateCodeForMouseDownEvent = (event) => {
    return `await page.mouse.down('${event.target}')`
  }

  generateCodeForMouseUpEvent = (event) => {
    return `await page.mouse.up('${event.target}')`
  }

  generateCodeForKeyboardEvent = (event) => {
    return `await page.press('${event.target}', '${event.key}')`
  }

  generateCodeForFillEvent = (event) => {
    // Possibly use page.type(event.target, event.value)
    // Depending on time between events
    return `await page.fill('${event.target}', '${event.value}')`
  }

  generateCodeForPageLoadEvent = (event) => {
    return `await page.waitForLoadState('domcontentloaded')`
  }
  
  // mousemove
  
}


module.exports = {
  CodeGenerator
}