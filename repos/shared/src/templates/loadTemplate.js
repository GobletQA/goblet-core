const path = require('path')
const { template } = require('@keg-hub/jsutils')
const { aliases } = require('@GConfigs/aliases.config')
const { getFileContent } = require('@GSH/Utils/getFileContent')

const templateLoc = aliases[`@GSH/Template`]
const templates = {
  reports404: path.join(templateLoc, 'reports.404.html'),
  page404: path.join(templateLoc, 'page.404.html'),
  feature: path.join(templateLoc, 'feature.template.feature'),
  definition: path.join(templateLoc, 'definition.template.js'),
  support: path.join(templateLoc, 'support.template.js'),
  emptyJS: path.join(templateLoc, 'empty.template.js'),
  unit: path.join(templateLoc, 'unit.template.js'),
  waypoint: path.join(templateLoc, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}
