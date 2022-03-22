const path = require('path')
const { template } = require('@keg-hub/jsutils')
const { aliases } = require('HerkinConfigs/aliases.config')
const { getFileContent } = require('../utils/getFileContent')

const templates = {
  reports404: path.join(aliases.HerkinBackTemplates, 'reports.404.html'),
  page404: path.join(aliases.HerkinBackTemplates, 'page.404.html'),
  feature: path.join(aliases.HerkinBackTemplates, 'feature.template.feature'),
  definition: path.join(aliases.HerkinBackTemplates, 'definition.template.js'),
  support: path.join(aliases.HerkinBackTemplates, 'support.template.js'),
  emptyJS: path.join(aliases.HerkinBackTemplates, 'empty.template.js'),
  unit: path.join(aliases.HerkinBackTemplates, 'unit.template.js'),
  waypoint: path.join(aliases.HerkinBackTemplates, 'waypoint.template.js'),
}

const loadTemplate = async (name, data, altName) => {
  const content = await getFileContent(templates[name] || templates[altName] || templates.page404)
  return template(content, data)
}

module.exports = {
  loadTemplate,
}
