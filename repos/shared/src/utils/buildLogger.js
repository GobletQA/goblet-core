const winston = require('winston')
const { noOpObj } = require('@keg-hub/jsutils')
const { safeReplacer } = require('./safeReplacer')

const { createLogger, transports, format } = winston
const { combine, label:logLabel, json, splat, timestamp, prettyPrint } = format

let __LOGGER

const buildLogger = (options=noOpObj, useDefault=true) => {
  if(useDefault && __LOGGER) return __LOGGER

  const {
    level=`info`,
    silent=false,
    pretty=true,
    exitOnError=false,
    handleExceptions=true,
    label=`Goblet`,
  } = options
  
  const winstonFormat = combine(
    splat(),
    timestamp(),
    logLabel({ label }),
    pretty
      ? prettyPrint({ colorize: true })
      : json({ replacer: safeReplacer })
  )

  const logger = createLogger({
    transports: [
      new transports.Console({
        handleExceptions: handleExceptions,
        level: level,
        format: winstonFormat,
      }),
    ],
    exitOnError: exitOnError,
    silent: silent,
  })
  
  if(!useDefault) return logger
  
  __LOGGER = logger
  return __LOGGER
}


module.exports = {
  buildLogger
}