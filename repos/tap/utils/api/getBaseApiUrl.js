
let urlMeta = {}
if(typeof window !== 'undefined') urlMeta = new URL(window.location.origin)

const { hostname, protocol } = urlMeta
const __IS_SECURE_HOST = protocol === 'https' ? true : false

/**
 * Returns the true if the current host url is secure (__IS_SECURE_HOST)
 *
 * @returns {boolean} - Value of __IS_SECURE_HOST
 */
export const isSecureHost = () => {
  return __IS_SECURE_HOST
}


/**
 * Builds the base url for all api calls using ENVs replaced at build time
 *
 * @returns {string} - Base Backend API url
 */
export const getBaseApiUrl = () => {

  
  // Use the hostname for the base on dev
  // Otherwise cookies will not be set, due to being served via http
  // If we start serving local dev via https, this this will not be needed
  let apiBaseHost = process.env.HERKIN_SERVER_HOST || hostname

  // If the port exists, then add it to the apiBase host
  process.env.SERVER_PORT &&
  !apiBaseHost.includes(`:`)
    (apiBaseHost += `:${process.env.SERVER_PORT}`)

  // Remove all protocols variations, to ensure it does not exist
  const noProtoHost = apiBaseHost.replace(`https://`, '')
    .replace(`http://`, '')
    .replace(`wss://`, '')
    .replace(`ws://`, '')

  // Use the windows current protocol to set the servers protocol
  // They should always match
  // Deployed environments will be https, local is http
  const proto = protocol === 'https' ? 'https' : 'http'

  return `${proto}://${noProtoHost}`
  
  // TODO: @lance-tipton - Make this dynamic
  // return `https://herkin.backend.herkin.app`
  // return `http://${apiBaseHost}:${process.env.SERVER_PORT}`
}

