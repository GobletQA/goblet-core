

/**
 * Helper method to parse a string of origins, and convert them to a cleaned array
 */
const generateOrigins = (originsStr=``) => {
  return (originsStr).split(',')
    .reduce((acc, origin) => {
      const host = (origin || '').trim()
      if(!host || acc.includes(host)) return acc

      const cleaned = host.replace(`https://`, '')
        .replace(`http://`, '')
        .replace(`wss://`, '')
        .replace(`ws://`, '')
      
      !acc.includes(cleaned) &&
        acc.push(
          cleaned,
          `https://${cleaned}`,
          `http://${cleaned}`,
          `wss://${cleaned}`,
          `ws://${cleaned}`
        )

      return acc
    }, [])
}

module.exports = {
  generateOrigins
}