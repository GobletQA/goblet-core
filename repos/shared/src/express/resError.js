/**
 * Helper to add a status code of a response to an Error instance
 * @param {string} message - The error message
 * @param {number} [statusCode=400] - The response status code
 * @param {boolean} [throwErr=true] - Should the error be thrown or returned
 */
const resError = (message, statusCode, throwErr = true) => {
  const error = new Error(message || `Failed to complete request`)
  error.statusCode = statusCode || 400

  if (throwErr) throw error

  return error
}

module.exports = {
  resError,
}
