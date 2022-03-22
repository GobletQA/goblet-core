// TODO: Implement Gitlab / BitBucket providers via OAuth Provider
// import { GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth"
import { get, set, isArr, isObj } from '@keg-hub/jsutils'

const FBProviders = {
  GithubAuthProvider
}

/**
 * Configures the auth providers defined in the config object
 * Ensures the providers is setup for allow logging in
 * @param {Object} config - Firebase config
 *
 * @returns {Object} - config with the auth providers setup for UI sign in
 */
const setupAuthProviders = config => {
  if (!config) return config

  const { version, signInOptions, ...uiConfig } = config.ui

  const authWithId = !isArr(signInOptions)
    ? signInOptions
    : signInOptions.map(provider => {
        if (!isObj(provider)) return provider
        
        const ProviderClass = FBProviders[provider.name] 
        if(!ProviderClass) throw new Error(`Missing Auth Provider Class for "${provider.name}"`)

        const instance = new ProviderClass()
        isArr(provider.scopes)
          ? provider.scopes.map(scope => instance.addScope(scope))
          : isStr(provider.scopes) && instance.addScope(provider.scopes)

        return instance
      })

  set(config, 'ui', {
    ...uiConfig,
    signInOptions: authWithId,
  })

  return config
}

let rawConfig
try {
  rawConfig = JSON.parse(process.env.FIRE_BASE_CONFIG)
  if (rawConfig && rawConfig.serviceAccount)
    throw new Error(
      `[FIREBASE ERROR] The firebase service account should not be used on the frontend.`
    )
} catch (err) {
  console.log(`------- FIREBASE PARSE ERROR -------`)
  console.log(err.message)
}

export const getConfig = () => rawConfig && setupAuthProviders(rawConfig)


