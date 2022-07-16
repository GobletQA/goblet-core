const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GSU]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
