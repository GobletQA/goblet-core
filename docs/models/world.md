# World
* Global object containing metadata about the repo
* All properties and values must be serializable
* Allows defining repo specific values that are accessible durning test execution and automation tasks 

## Properties
* Any property is allow to exist on the world as long as it is serializable
* The property values should **NOT** contain secrets or sensitive information
* Some properties and their values are reserved, but can be overwritten
  * If a reserved property value is overwritten, test execution and automation tasks will not run as expected
  * It is **recommended** to not override a reserved property with an incorrect value
* The world object is shared with each text durning execution and within automated task
  * This allows for world properties to be accessed and used durning the currently running process
  * See the [Accessing the World](#accessing-the-world) for more information

### Reserved Properties
* `$world.app`
  * @type => `Object`
  * @description => Contains properties relative to the active application (repository)
* `$world.app.url`
  * @type => `String`
  * @description => Root Url of the application, auto-loaded into the Browser when in VNC mode
* `$world.alias`
  * @type => `Object`
  * @description => Contains alias's defined as key/value pairs that are injected at runtime

## Accessing the World

### Step Definitions
* When a step definition is called from a match Feature file step, the world is always passed as the last argument
### Unit Tests
* The world is accessible via a utility method that can be imported into the test file
* *TODO: Add example*
### Waypoint
* The world is accessible via a utility method that can be imported into the waypoint file
* *TODO: Add example*

## World Alias
* An alias is a key/value pair, that allows defining a reference between to pieces of text
* For example, the commonly used expression `lol`, is an alias for `laugh out loud`
* *TODO: Add more info*