const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GTU]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
