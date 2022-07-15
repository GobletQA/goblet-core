const path = require('path')
const { template } = require('@keg-hub/jsutils')
const { aliases } = require('@GConfigs/aliases.config')
const { getFileContent } = require('@GSH/Utils/getFileContent')

const templates = {
  reports404: path.join(aliases.@GSH/Template, 'reports.404.html'),
  page404: path.join(aliases.@GSH/Template, 'page.404.html'),
  feature: path.join(aliases.@GSH/Template, 'feature.template.feature'),
  definition: path.join(aliases.@GSH/Template, 'definition.template.js'),
  support: path.join(aliases.@GSH/Template, 'support.template.js'),
  emptyJS: path.join(aliases.@GSH/Template, 'empty.template.js'),
  unit: path.join(aliases.@GSH/Template, 'unit.template.js'),
  waypoint: path.join(aliases.@GSH/Template, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}
