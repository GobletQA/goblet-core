const { apiErr } = require('./apiErr')
const { isFunc } = require('@keg-hub/jsutils')

/**
 * Wraps a request handler in a try/catch
 * If the handler throws, the passed in errorHandler or default handler is called
 * @param {function} handler - Request handler method ( Controller method )
 * @param {function} errHandler - Custom error handler method
 *
 * @returns {function} - Wrapped handler method
 */
const asyncWrap =
  (handler, errHandler = apiErr) =>
  async (...args) => {
    try {
      await handler(...args)
    } catch (err) {
      const errMethod = asyncWrap.errHandler || errHandler || args[2]

      isFunc(errMethod) &&
        errMethod(err, err.status || err.statusCode || 400, ...args)
    }
  }

module.exports = {
  asyncWrap,
}
