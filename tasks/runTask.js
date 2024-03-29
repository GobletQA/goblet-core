process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
const { setLogs } = require('@keg-hub/jsutils')
process.env.TASKS_DEBUG && setLogs(true, `log`, `[Goblet]`)

require('@keg-hub/cli-utils').runTask(require('./index'), { env: process.env.NODE_ENV || 'local' })
