const { noPropArr } = require('@keg-hub/jsutils')

/**
 * The env should only be set on the sockr.cmd.sh script
 * This way we know if it's coming from the herkin frontend
 */
const { HERKIN_RUN_FROM_UI } = process.env

/**
 * Exits the process, once the tests are complete
 * @exits
 * @param {Array<string|number>} exitCodes - exit code of each test in container
 */
const handleTestExit = (exitCodes=noPropArr, reportPath) => {
  const codeSum = exitCodes.reduce((sum, code) => sum + parseInt(code, 10), 0)

  // If not running from the UI, then print the view reports message
  !HERKIN_RUN_FROM_UI &&
    process.on('exit', () => {

      const reportSplit = reportPath.split('/')
      const name = reportSplit.pop().replace('.html', '')
      const type = reportSplit.pop()
      const url = `http://localhost:5005/reports/${type}/${name}`

      console.log('=====================================================\n')
      console.log('\x1b[33m%s\x1b[0m', 'View test report:', url) 
      console.log('\n=====================================================')
    })

  process.exit(codeSum)
}

module.exports = {
  handleTestExit
}