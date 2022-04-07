class CodeGenerator {
  recorder = undefined

  constructor(recorder) {
    this.recorder = recorder
  }

  getCode = () => {
    return this.recorder.getProcessedEvents().map(event => this.codeFromEvent(event))
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
    }

    return ''
  }

  generateCodeForClickEvent = (event) => {
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
    return `await page.fill('${event.target}', '${event.inputValue}')`
  }

  generateCodeForPageLoadEvent = (event) => {
    return `await page.waitForLoadState()`
  }
}


module.exports = {
  CodeGenerator
}