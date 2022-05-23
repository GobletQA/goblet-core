import { isDev } from '../isDev'
let __BASE_API_URL

/**
 * Returns the true if the current host url is secure
 *
 * @returns {boolean} - True if the host is secure
 */
export const isSecureHost = () => {
  if(typeof window === 'undefined') return false

  const { protocol } = new URL(window.location.origin)
  return protocol === 'http' ? false : true
}

/**
 * Builds the base url for all api calls using ENVs replaced at build time
 *
 * TODO: @lance-tipton - Make this dynamic
 * Staging api should be = `https://herkin.backend.herkin.app`
 * @returns {string} - Base Backend API url
 */
export const getBaseApiUrl = () => {
  if(__BASE_API_URL) return __BASE_API_URL

  // Use the hostname for the base on dev
  // Otherwise cookies will not be set, due to being served via http
  // If we start serving local dev via https, this this will not be needed
  let apiBaseHost = process.env.HERKIN_SERVER_HOST || hostname

  // If the port exists, then add it to the apiBase host
  process.env.SERVER_PORT &&
  !apiBaseHost.includes(`:`) &&
    (apiBaseHost += `:${process.env.SERVER_PORT}`)

  // Remove all protocols variations, to ensure it does not exist
  const noProtoHost = apiBaseHost.replace(`https://`, '')
    .replace(`http://`, '')
    .replace(`wss://`, '')
    .replace(`ws://`, '')

  // Use the windows current protocol to set the servers protocol
  // They should always match
  // Deployed environments will be https, local is http
  const { protocol } = new URL(window.location.origin)
  const proto = protocol === 'https' ? 'https' : 'http'
  __BASE_API_URL = `${proto}://${noProtoHost}`

  // TODO: Remove this once it's working properly
  if(!isDev && __BASE_API_URL !== `https://herkin.backend.herkin.app`){
    console.log(`In non local env, but base api was set to:`, __BASE_API_URL)
    __BASE_API_URL = `https://herkin.backend.herkin.app`
  }

  return __BASE_API_URL
}

