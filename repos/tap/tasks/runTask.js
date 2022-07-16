const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GTap]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
