const { argsParse } = require("@keg-hub/args-parse")
const { checkCall } = require('@keg-hub/jsutils')

const executeTask = (taskModule, task, name) => {
  return taskModule.parent
    ? (taskModule.exports = { [name]: task })
    : (async () => {
        const params = await argsParse({
          task,
          args: process.argv.slice(2)
        })
        await checkCall(task.action, { params })
      })()
}

module.exports = {
  executeTask
}