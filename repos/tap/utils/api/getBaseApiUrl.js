// Use the hostname for the base on dev
// Otherwise cookies will not be set, due to being served via http
// If we start serving local dev via https, this this will not be needed
// const apiBaseHost = ['staging', 'qa', 'production'].includes(
//   process.env.NODE_ENV
// )
//   ? process.env.SERVER_HOST
//   : window.location.hostname

/**
 * Builds the base url for all api calls using ENVs replaced at build time
 *
 * @returns {string} - Base Backend API url
 */
export const getBaseApiUrl = () => {
  // return `http://backend.herkin.app:5005`
  // return `http://herkin-develop.local.keghub.io:5005`
  return `https://herkin.backend.herkin.app`
  // return `http://${apiBaseHost}:${process.env.SERVER_PORT}`
}

