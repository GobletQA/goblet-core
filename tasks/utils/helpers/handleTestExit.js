const { noPropArr } = require('@keg-hub/jsutils')

/**
 * Exits the process, once the tests are complete
 * @param {Array<string|number>} exitCodes - exit code of each test in container
 * 
 * @returns the exit code sum of the executed test commands
 */
const handleTestExit = (exitCodes = noPropArr, reportPaths=noPropArr) => {
  const { GOBLET_RUN_FROM_UI, GOBLET_RUN_FROM_CI } = process.env
  const codeSum = exitCodes.reduce((sum, code) => sum + parseInt(code, 10), 0)

  /**
   * The GOBLET_RUN_FROM_UI || GOBLET_RUN_FROM_CI env should only be set in those contexts
   * This way we know if it's coming an external context and not being run locally
   * If run locally then print the view reports as needed
   */
  !GOBLET_RUN_FROM_UI &&
    !GOBLET_RUN_FROM_CI &&
    reportPaths &&
    reportPaths.length &&
    process.on('exit', () => {
      console.log('=====================================================\n')
      console.log('\x1b[33m%s\x1b[0m', 'View test reports:')
      reportPaths.map(reportPath => {
        const reportSplit = reportPath.split('/')
        const name = reportSplit.pop().replace('.html', '')
        const type = reportSplit.pop()
        console.log(`http://localhost:7005/reports/${type}/${name}`)
      })
      console.log('\n=====================================================')
    })

  return codeSum
}

module.exports = {
  handleTestExit,
}
