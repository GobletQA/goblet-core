# Goblet Secrets

* Custom secrets loaded from a mounted repo


### Goblet Config

* The `environmentsDir` must be defined in the `goblet.config#paths` object
  * This tells Goblet what folder to load the secret files from


## Secrets.env File

* The name of the file is **IMPORTANT**
* The `environmentsDir` path defined in the `goblet.config#paths`, will be searched
  * If a file named `secrets.env` is found, the environment variables from that file will be loaded **first**
* Next, if the environment variable `GOBLET_ENV` exists
  * The value of `GOBLET_ENV` will be used to search for a matching file
  * The file name must match the pattern `secrets.<GOBLET_ENV>.env`, replacing `<GOBLET_ENV>` with the value
    * For example
      * If the value of the `GOBLET_ENV` environment variable is `develop`
      * Then the environment variables from the file `secrets.develop.env` would be loaded
* Loading secrets with this pattern allows
  * Setting default secrets in the `secrets.env` file
  * Setting override secrets based on the current environment in `secrets.<GOBLET_ENV>.env` files

## Secrets from process.env

* Secrets can also be loaded from the current environment via the `process.env` object
* **IMPORTANT** - Not all environment variables from the `process.env` object are loaded
  * For a secret to be loaded from the `process.env` object
    * **It must already be defined in a Secrets.env file**
* This ensures only ENVs explicitly defined, can be loaded from the current environment
* To define an ENV, and ensure it's loaded from the current environment
  * Define the key in the `secrets.env` file, and set it's value to an empty string


## Encryption
* TODO

## Examples
* TODO