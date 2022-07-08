const path = require('path')
const { template } = require('@keg-hub/jsutils')
const { aliases } = require('GobletConfigs/aliases.config')
const { getFileContent } = require('GobletSharedUtils/getFileContent')

const templates = {
  reports404: path.join(aliases.GobletSharedTemplate, 'reports.404.html'),
  page404: path.join(aliases.GobletSharedTemplate, 'page.404.html'),
  feature: path.join(aliases.GobletSharedTemplate, 'feature.template.feature'),
  definition: path.join(aliases.GobletSharedTemplate, 'definition.template.js'),
  support: path.join(aliases.GobletSharedTemplate, 'support.template.js'),
  emptyJS: path.join(aliases.GobletSharedTemplate, 'empty.template.js'),
  unit: path.join(aliases.GobletSharedTemplate, 'unit.template.js'),
  waypoint: path.join(aliases.GobletSharedTemplate, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}
