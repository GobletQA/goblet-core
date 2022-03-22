const browser = require('./browser')
const screencast = require('./screencast')
const vnc = require('./vnc')

module.exports = (...args) => {
  browser(...args)
  screencast(...args)
  vnc(...args)
}
