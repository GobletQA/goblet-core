const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GWF]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
