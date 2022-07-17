#!/usr/bin/env node
require('../../configs/aliases.config').registerAliases()
module.exports = require('./src')
