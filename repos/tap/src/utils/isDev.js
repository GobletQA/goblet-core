const nodeEnv = process.env.NODE_ENV

/**
 * Checks if the current environment is running in dev
 * @type {boolean}
 */
export const isDev =
  nodeEnv !== 'qa' && nodeEnv !== 'staging' && nodeEnv !== 'production'
