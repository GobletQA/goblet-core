const { isObj, isFunc, mapObj } = require('@keg-hub/jsutils')
const { getGobletConfig } = require('GobletSharedConfig')

/**
 * Injects the goblet.config into a tasks arguments
 * @param {function} taskAction - Function called when a task is run
 *
 * @return {function} - Function to inject the herkin config
 */
const injectHerkinConfig = taskAction => {
  return args =>
    taskAction({
      ...args,
      herkin: getGobletConfig(args.params),
    })
}

/**
 * Loops the herkin custom tasks, and injects the goblet.config as an argument
 * @param {Object} tasks - Task definitions to inject the goblet.config into
 *
 * @return {Object} - tasks with the goblet.config injected
 */
const initialize = tasks => {
  mapObj(tasks, (key, task) => {
    task.action = isFunc(task.action) && injectHerkinConfig(task.action)
    task.tasks = isObj(task.tasks) && initialize(task.tasks)
  })

  return tasks
}

module.exports = {
  ...initialize(require('./tap')),
  ...initialize(require('./deploy')),
  ...initialize(require('./metadata')),
  ...initialize(require('./waypoint')),
  ...initialize(require('./unit')),
  ...initialize(require('./bdd')),
}
