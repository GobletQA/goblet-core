import { exists, toBool } from '@keg-hub/jsutils'
const { GOBLET_REPLACE_ONLY_EMPTY } = process.env

/**
 * If true, ENVs from process.env only overwrite ENVs from Values.env files when they are an empty string
 * Must be explicitly set to false to disable the behavior
 */
export const getReplaceOnlyEmpty = (ext?:any) => {
  return exists(ext)
    ? toBool(ext)
    : exists(GOBLET_REPLACE_ONLY_EMPTY)
      ? toBool(GOBLET_REPLACE_ONLY_EMPTY)
      : true
}

