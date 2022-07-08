const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[Goblet]`)

require('@keg-hub/cli-utils').runTask()
