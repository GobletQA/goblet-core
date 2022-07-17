const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GCD]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
