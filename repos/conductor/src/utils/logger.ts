
import { capitalize } from '@keg-hub/jsutils'
import { Logger as CliLogger } from '@keg-hub/cli-utils'

const loggerWrap = (
  method:string,
  tagColor:string=method,
  inTag?:boolean,
  logColor?:string
) => {
  const extra = inTag ? ` ${capitalize(method)}` : ''
  const tag = `[Conductor${extra}]`

  return (...args:any[]) => {
    CliLogger.setTag(tag, tagColor)
    CliLogger[method](
      ...logColor
        ? args.map((arg:any) => Logger.colors[logColor](arg))
        : args
    )
    CliLogger.removeTag()
  }
}

export const Logger = {
  ...CliLogger,
  log: loggerWrap(`log`, `cyan`, false, `white`),
  info: loggerWrap(`info`, `cyan`, false, `white`),
  error: loggerWrap(`error`, `red`, true, `white`),
  warn: loggerWrap(`warn`, `yellow`, true, `white`),
  success: loggerWrap(`success`, `green`, true, `white`),
}

