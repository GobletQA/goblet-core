
import path from 'path'
import { loadEnvSync } from '@keg-hub/parse-config'
import { getPathFromConfig } from '../utils/getPathFromConfig'
const environmentsDir = getPathFromConfig(`environmentsDir`)

type TLoadEnvFile = {
  file?:string
  error?:boolean
  location?:string
}

export const loadEnvFile = ({
  file,
  location,
  error=false,
}: TLoadEnvFile):Record<string, any> => {
  return loadEnvSync({
    error,
    location: location || path.join(environmentsDir, file)
  })
}