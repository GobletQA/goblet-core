const { Logger } = require('@keg-hub/cli-utils')
const { capitalize } = require('@keg-hub/jsutils')
const { PARKIN_SPEC_RESULT_LOG } = require('@GTU/constants/constants')

const logParkinStatus = (parkinObj) => {
  switch(parkinObj.action){
    case `start`: {
      const name = parkinObj.type !== `step`
        ? parkinObj.fullName || parkinObj.description
        : parkinObj.description || parkinObj.fullName

      return name && Logger.pair(`Running ${name.trim()}`)
    }
    case `end`: {
      const type = parkinObj.type
      const status = parkinObj.status
      const name = parkinObj.description || parkinObj.fullName

      return name && type && status
        ? parkinObj.type !== `step`
          ? Logger.log(`${name.trim()}: ${status.trim()}`)
          : Logger.log(`  ${status.trim()} - ${name.trim()} (${capitalize(type).trim()})`) 
        : undefined
    }
  }
}

const parseParkinLogs = (data, params) => {
  try {
    const splitData = data.split(PARKIN_SPEC_RESULT_LOG)
      .reduce((acc, item) => {
        const cleaned = item.trim()
        const objMatch = cleaned.startsWith(`{`) && cleaned.endsWith(`}`)
        if(!objMatch){
          acc.other.push(cleaned)
          return acc
        }
        const parkinObj = JSON.parse(cleaned)
        acc.parkin.push(parkinObj)
        logParkinStatus(parkinObj)

        return acc
      }, { parkin: [], other: [] })

    splitData.other  = splitData.other.join(`\n`)
    return splitData
  }
  catch(err){
    Logger.error(`[Goblet] Parse parkin logs error...`)
    Logger.log(err)

    return { other }
  }

}


module.exports = {
  parseParkinLogs,
  PARKIN_SPEC_RESULT_LOG
}