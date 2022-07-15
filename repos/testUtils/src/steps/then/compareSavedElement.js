const { Then } = require('@GTU/Parkin')
const { deepMerge } = require('@keg-hub/jsutils')
const { compareValues, getLocatorAttribute, getWorldData } = require('@GTU/Support/helpers')

/**
 * Compares an elements property with a saved elements property
 * @param {string} selector - valid playwright selector
 * @param {string} prop - property of a playwright locator
 * @param {string} typeJoin - Type of comparison to evaluate
 * @param {string} worldPath - Path on the world object
 * @param {string} worldProp - property of a playwright locator
 * @param {Object} world - Global world object
 */
const compareElements = async (selector, prop, typeJoin, worldPath, worldProp, world) => {
  const { element:saved } = getWorldData(worldPath, world)
  if(!saved[worldProp]) throw new Error(`Saved Element property "${worldProp}" does not exist.`)

  const savedVal = await saved[worldProp]()
  const elementVal = await getLocatorAttribute(selector, prop)

  const [type, order] = typeJoin.split('-')
  order === 'world'
    ? compareValues(elementVal, savedVal, type)
    : compareValues(savedVal, elementVal, type)
}

/**
 * Compares an elements property with a saved world value
 * @param {string} selector - valid playwright selector
 * @param {string} prop - property of a playwright locator
 * @param {string} typeJoin - Type of comparison to evaluate
 * @param {string} worldPath - Path on the world object
 * @param {Object} world - Global world object
 */
const compareToWorldValue = async (selector, prop, typeJoin, worldPath, world) => {
  const savedVal = getWorldData(worldPath, world)
  const elementVal = await getLocatorAttribute(selector, prop)

  const [type, order] = typeJoin.split('-')

  order === 'world'
    ? compareValues(elementVal, savedVal, type)
    : compareValues(savedVal, elementVal, type)
}


// Default metadata used for building the definitions meta-data
const metaBase = {
  examples: [],
  module : `compareSavedElement`,
  description: `Locates an element by selector and compares a property with a previously saved element.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the element.`,
      example: 'input#amount',
    },
    {
      type: 'word',
      description: `The property of the selected element to compare`,
      example: 'textContent',
    },
  ],
}

// Compares a selected elements prop against a saved value
const elToVal = {
  description: `Compares a selected elements prop against a saved value`,
  examples: [
    `Then "input#amount" value matches "3"`,
    `Then "input#amount" value matches "app.saved.amount"`,
    `Then "input#amount" value contains "app.saved.amount"`,
  ],
  expressions: [
    ...metaBase.expressions,
    {
      type: 'string',
      example: 'context.selected',
      description: `An inline value or a path on the world where the saved data exists`,
    }
  ]
}
Then(
  '{string} {word} matches {string}',
  (sel, prop, wPath, world) => compareToWorldValue(sel, prop, `matches-world`, wPath, world),
  elToVal
)
Then(
  '{string} {word} contains {string}',
  (sel, prop, wPath, world) => compareToWorldValue(sel, prop, `contains-world`, wPath, world),
  elToVal
)


// Compares a value or world path value against a selected elements property
const valToElMeta = {
  description: `Compares a value or world path value against a selected elements property.`,
  examples: [
    `Then "3" matches "input#amount" value`,
    `Then "app.saved.amount" matches "input#amount" value`,
    `Then "app.saved.amount" contains "input#amount" value`,
  ],
  expressions: [
    {
      type: 'string',
      example: 'context.selected',
      description: `An inline value or a path on the world where the saved data exists`,
    },
    ...metaBase.expressions
  ]
}
Then(
  '{string} matches element {string} {word}',
  (wPath, type, sel, prop, world) => compareToWorldValue(sel, prop, `matches-el`, wPath, world),
  valToElMeta
)
Then(
  '{string} contains element {string} {word}',
  (wPath, type, sel, prop, world) => compareToWorldValue(sel, prop, `contains-el`, wPath, world),
  valToElMeta
)


// Compares a selected elements property against a saved elements property
const elToSaved = deepMerge(metaBase, {
  description: `Compares a selected elements prop against a saved elements prop.`,
  examples: [
    `Then "input#amount" value contains saved`,
    `Then "input#amount" value matches saved`
  ]
})
Then(
  '{string} {word} matches saved',
  (sel, prop, world) => compareElements(sel, prop, `matches-world`, `__meta.savedElement`, prop, world),
  elToSaved
)
Then(
  '{string} {word} contains saved',
  (sel, prop, world) => compareElements(sel, prop, `contains-world`, `__meta.savedElement`, prop, world),
  elToSaved
)

// Compare with prop world saved element to selected element
const savedToEl = deepMerge(metaBase, {
  description: `Compares a saved elements prop against a selected elements prop.`,
  examples: [
    `Then saved contains "input#amount" value`,
    `Then saved matches "input#amount" value`,
  ],
})
Then(
  'saved matches {string} {word}',
  (sel, prop, world) => compareElements(sel, prop, `matches-el`, `__meta.savedElement`, prop, world),
  savedToEl
)
Then(
  'saved contains {string} {word}',
  (sel, prop, world) => compareElements(sel, prop, `contains-el`, `__meta.savedElement`, prop, world),
  savedToEl
)


// Compare with prop selected element to world path element
const elToWorldNoProp = deepMerge(metaBase, {
  description: `Compares an element prop located by a selector with a previously saved element prop.`,
  examples: [
    `Then element "input#amount" value contains "context.selected"`,
    `Then element "input#amount" value matches "context.selected"`,
  ],
  expressions: [{
    type: 'string',
    description: `Path on the world where the saved element exists`,
    example: 'context.selected',
  }]
})

Then(
  'element {string} {word} matches {string}',
  (sel, prop, wPath, world) =>  compareElements(sel, prop, `matches-world`, wPath, prop, world),
  elToWorldNoProp
)
Then(
  'element {string} {word} contains {string}',
  (sel, prop, wPath, world) =>  compareElements(sel, prop, `contains-world`, wPath, prop, world),
  elToWorldNoProp
)


// Compares a previously saved element prop with an element prop located by a selector.
const worldToElNoProp = {
  description: `Compares a previously saved element prop with an element prop located by a selector.`,
  examples: [
    `Then "context.selected" contains "input#amount" value`,
    `Then "context.selected" matches "input#amount" value`,
  ],
  expressions: [
    {
      type: 'string',
      description: `Path on the world where the saved element exists`,
      example: 'context.selected',
    },
    ...metaBase.expressions
  ]
}
Then(
  '{string} matches {string} {word}',
  (wPath, sel, prop, world) =>  compareElements(sel, prop, `matches-el`, wPath, prop, world),
  worldToElNoProp
)
Then(
  '{string} contains {string} {word}',
  (wPath, sel, prop, world) =>  compareElements(sel, prop, `contains-el`, wPath, prop, world),
  worldToElNoProp
)


// Compares an element prop located by a selector with a previously saved element prop.
const elToWorldWProps = {
  description: `Compares an element prop located by a selector with a previously saved element prop.`,
  examples: [
    `Then "input#amount" value contains "context.selected" value`,
    `Then "input#amount" value matches "context.selected" value`,
  ],
  expressions: [
    ...metaBase.expressions,
    {
      type: 'string',
      description: `Path on the world where the saved element exists`,
      example: 'context.selected',
    },
    {
      type: 'word',
      description: `The property of the saved element to compare`,
      example: 'value',
    },
  ]
}

Then(
  '{string} {word} matches {string} {word}',
  (sel, prop, ...args) =>  compareElements(sel, prop, `matches-world`, ...args),
  elToWorldWProps
)
Then(
  '{string} {word} contains {string} {word}',
  (sel, prop, ...args) =>  compareElements(sel, prop, `contains-world`, ...args),
  elToWorldWProps
)


// Compares a previously saved element prop with an element prop located by a selector.
const worldToElWProps = {
  description: `Compares a previously saved element prop with an element prop located by a selector.`,
  examples: [
    `Then "context.selected" value matches element "input#amount" value`,
    `Then "context.selected" value contains element "input#amount" value`,
  ],
  expressions: [
    {
      type: 'string',
      description: `Path on the world where the saved element exists`,
      example: 'context.selected',
    },
    {
      type: 'word',
      description: `The property of the saved element to compare`,
      example: 'value',
    },
    ...metaBase.expressions,
  ]
}

Then(
  '{string} {word} matches element {string} {word}',
  (wPath, wProp, sel, prop, world) =>  compareElements(sel, prop, `matches-el`, wPath, wProp, world),
  worldToElWProps
)
Then(
  '{string} {word} contains element {string} {word}',
  (wPath, wProp, sel, prop, world) =>  compareElements(sel, prop, `contains-el`, wPath, wProp, world),
  worldToElWProps
)


module.exports = {
  compareElements,
  compareToWorldValue
}

