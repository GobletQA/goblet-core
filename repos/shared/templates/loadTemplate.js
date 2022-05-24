const path = require('path')
const { template } = require('@keg-hub/jsutils')
const { aliases } = require('HerkinConfigs/aliases.config')
const { getFileContent } = require('HerkinSharedUtils/getFileContent')

const templates = {
  reports404: path.join(aliases.HerkinSharedTemplate, 'reports.404.html'),
  page404: path.join(aliases.HerkinSharedTemplate, 'page.404.html'),
  feature: path.join(aliases.HerkinSharedTemplate, 'feature.template.feature'),
  definition: path.join(aliases.HerkinSharedTemplate, 'definition.template.js'),
  support: path.join(aliases.HerkinSharedTemplate, 'support.template.js'),
  emptyJS: path.join(aliases.HerkinSharedTemplate, 'empty.template.js'),
  unit: path.join(aliases.HerkinSharedTemplate, 'unit.template.js'),
  waypoint: path.join(aliases.HerkinSharedTemplate, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}
