const { getGobletConfig } = require('@GSH/Config')
const { isObj, isFunc, mapObj } = require('@keg-hub/jsutils')

/**
 * Injects the goblet.config into a tasks arguments
 * @param {function} taskAction - Function called when a task is run
 *
 * @return {function} - Function to inject the goblet config
 */
const injectGobletConfig = taskAction => {
  return args =>
    taskAction({
      ...args,
      goblet: getGobletConfig(args.params),
    })
}

/**
 * Loops the goblet custom tasks, and injects the goblet.config as an argument
 * @param {Object} tasks - Task definitions to inject the goblet.config into
 *
 * @return {Object} - tasks with the goblet.config injected
 */
const initialize = tasks => {
  mapObj(tasks, (key, task) => {
    task.action = isFunc(task.action) && injectGobletConfig(task.action)
    task.tasks = isObj(task.tasks) && initialize(task.tasks)
  })

  return tasks
}

module.exports = {
  initialize,
  injectGobletConfig
}