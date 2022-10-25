# Goblet Values

* Custom environment values loaded from a mounted repo


### Goblet Config

* The `environmentsDir` must be defined in the `goblet.config#paths` object
  * This tells Goblet what folder to load the value environment files from

## Values.env File

* The name of the file is **IMPORTANT**
* The `environmentsDir` path defined in the `goblet.config#paths`, will be searched
  * If a file named `values.env` is found, the ENVs from that file will be loaded **first**
* Next, if the environment variable `GOBLET_ENV` exists
  * The value of `GOBLET_ENV` will be used to search for a matching file
  * The file name must match the pattern `values.<GOBLET_ENV>.env`, replacing `<GOBLET_ENV>` with the value
    * For example
      * If the value of the `GOBLET_ENV` environment variable is `develop`
      * Then the ENVs from the file `values.develop.env` are loaded
* Loading values with this pattern allows
  * Setting default values in the `values.env` file
  * Setting override values based on the current environment in `values.<GOBLET_ENV>.env` files


## Values from process.env

* Values can also be loaded from the current environment via the `process.env` object
* **IMPORTANT** - Not all ENVs from the `process.env` object are loaded
  * For an ENV to be loaded from the `process.env` object
    * **The KEY must already be defined in a Values.env file**
* This ensures only ENVs explicitly defined, can be loaded from the current environment
* To define an ENV, and ensure it's loaded from the current environment
  * Define the KEY in the `values.env` file, and set it's value to an empty string

### ENV - GOBLET_REPLACE_ONLY_EMPTY
* By default ENVs loaded from Value.env files are
  * **Only** overwritten by the `process.env` object if their value is an empty string
  * ENVs that have a value that is **NOT** an empty string, will **NOT** be overwritten
* Set the ENV `GOBLET_REPLACE_ONLY_EMPTY` to a `falsy` value, to disable this behavior
  * When `false`, the ENVs from the `process.env` object will always override ENVs in Value.env files
  * The ENVs must still be defined in a Value.env file even when `GOBLET_REPLACE_ONLY_EMPTY` is false

### Notes
* A `truthy` value is one of `true` | `t` | `1` | `y` | `yes` | `non-empty string`
* A `falsy` value is one of `false` | `f` | `0` | `n` | `no` | `empty string`

## Examples

### Overriding based on environment

* **Given** the ENV `GOBLET_ENV` has a value of `qa`
* **Given** the following files exist in the `environmentsDir` defined in `goblet.config#paths` object
  * `values.env`
  * `values.develop.env`
  * `values.qa.env`
* **Then**
  1. The ENVs in `values.env` are loaded
  2. The ENVs in `values.qa.env` are loaded, overwriting the existing values from `values.env`
  3. The ENVs in `values.dev.env` would **NOT** be loaded

### Overriding process.env and GOBLET_REPLACE_ONLY_EMPTY is not set

* **Given** the ENV `GOBLET_REPLACE_ONLY_EMPTY` is **not** set
* **Given** the ENV `CUSTOM_VALUE` has a value of `override-value`
* **Given** the file `values.env` exist in the `environmentsDir` defined in `goblet.config#paths` object
  * **And** has an ENV `CUSTOM_VALUE` with value of `default-value`
* **Then**
  1. The ENVs in `values.env` are loaded
  2. The ENVs from the `process.env` object are loaded
* **Then**
  1. The value of `CUSTOM_VALUE` is `default-value`
     * The `process.env` object does **NOT** override the value in `values.env`
       * Because the ENV `GOBLET_REPLACE_ONLY_EMPTY` is not set
     * All other values in the `process.env` object would **NOT** be loaded

### Overriding process.env and GOBLET_REPLACE_ONLY_EMPTY is false

* **Given** the ENV `GOBLET_REPLACE_ONLY_EMPTY` has a value of `false`
* **Given** the ENV `CUSTOM_VALUE` has a value of `override-value`
* **Given** the ENV `DEFINED_VALUE` has a value of `defined-override-value`
* **Given** the file `values.env` exist in the `environmentsDir` defined in `goblet.config#paths` object
    * **And** the file has the following ENVs defined
      *  `CUSTOM_VALUE=default-value`
      *  `DEFINED_VALUE=''`
* **Then**
  1. The ENVs in `values.env` are loaded
  2. The ENVs from the `process.env` object are loaded
* **Then**
  1. The value of `CUSTOM_VALUE` is `override-value`
    * The `process.env` object does override the value in `values.env`
    * Because the ENV `GOBLET_REPLACE_ONLY_EMPTY` is `false`
  2. The value of `DEFINED_VALUE` is `defined-override-value`
    * The value is set from the `process.env` object because it's defined in the `values.env` file


### Multiple Value.env files and process.env
* **Given** the ENV `GOBLET_REPLACE_ONLY_EMPTY` is `true`
* **Given** the ENV `GOBLET_ENV` has a value of `develop`
* **Given** the ENV `CUSTOM_VALUE` has a value of `override-value`
* **Given** the ENV `DEFINED_VALUE` has a value of `defined-value`
* **Given** the ENV `PROCESS_VALUE` has a value of `process-value`
* **Given** the following files exist in the `environmentsDir` defined in `goblet.config#paths` object
  * `values.env`
    * **And** the file has the following ENVs defined
      *  `CUSTOM_VALUE=default-value`
      *  `DEFINED_VALUE=''`
  * `values.develop.env`
    * **And** the file has the following ENVs defined
      *  `CUSTOM_VALUE=develop-value`
      *  `DEFINED_DEVELOP_VALUE='develop-value'`
* **Then**
  1. The ENVs in `values.env` are loaded
  2. The ENVs in `values.develop.env` are loaded, overwriting the existing values from `values.env`
  3. The ENVs from the `process.env` object are loaded
* **Then**
  1. The value of `CUSTOM_VALUE` is `develop-value`
     * The `process.env` object would **NOT** override the value in `values.env`
     * Because the ENV `GOBLET_REPLACE_ONLY_EMPTY` is `true`
  2. The value of `DEFINED_VALUE` is `defined-value`
     * The value is set from the `process.env` object because it's defined in the `values.env` file
  3. The value of `DEFINED_DEVELOP_VALUE` is `develop-value`
     * The value is set from the `values.develop.env` file
  4. The value of `PROCESS_VALUE` is `undefined`
     * It is not defined in either of the Value.env files, so it is **NOT** loaded

