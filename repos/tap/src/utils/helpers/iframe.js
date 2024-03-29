/**
 * Creates a new iframe at the provided url.
 * @param url The url to load.
 *
 * @returns {string} - Inlined html content for use as an iframe url
 */
export const fromURL = url => {
  if (!/^(https?|file|data):/.test(url))
    throw new Error('Protocol should be http(s) or file.')

  const frame = document.createElement('iframe')
  frame.style.display = 'none'
  frame.src = url

  return new Promise((resolve, reject) => {
    frame.addEventListener('load', resolve)
    frame.addEventListener('error', reject)
    document.body.appendChild(frame)
  }).then(() => new Frame(frame))
}

/**
 * Creates a new iframe and inline some html content.
 * @param html The html to load into the iframe.
 *
 * @returns {string} - Inlined html content for use as an iframe url
 */
export const fromHTML = html => {
  return fromURL(`data:text/htmlcharset=utf-8,${encodeURIComponent(html)}`)
}

/**
 * Frame - Model iframe dom element
 * @type class
 * @property {Object} window - The frame's window object
 * @property {Object} document - The frame's document object
 * @property {Method} close - Helper to remove the iframe from the dom
 *
 */
export class Frame {
  /**
   * The global window object for the iframe.
   */
  window = null

  /**
   * The document object for the iframe.
   */
  document = null

  /**
   * Creates a new iframe from in the browser.
   * @param _frame The iframe to use.
   */
  constructor(_frame) {
    this.window = _frame.contentWindow
    this.document = _frame.contentDocument || window.document
    this.close = () => document.body.removeChild(_frame)
  }

  /**
   * Closes the currently running iframe.
   */
  close = () => {}
}
