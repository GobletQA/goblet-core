const { Then } = require('HerkinParkin')
const { deepMerge } = require('@keg-hub/jsutils')
const { compareValues, getElementProp, getWorldData } = require('HerkinSupport/helpers')

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
  const elementVal = await getElementProp(selector, prop)

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
  const elementVal = await getElementProp(selector, prop)

  const [type, order] = typeJoin.split('-')

  order === 'world'
    ? compareValues(elementVal, savedVal, type)
    : compareValues(savedVal, elementVal, type)
}


const metaBase = {
  examples: [],
  module : `compareSavedElement`,
  description: `Locates an element by selector and compares a property with a previously saved element.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'input#amount',
    },
    {
      type: 'string',
      description: `The property of the selected element to compare`,
      example: 'textContent',
    },
  ],
}

const elToWorldMeta = deepMerge(metaBase, {
  examples: [
    `Then "input#amount" value matches "3"`,
    `Then "input#amount" value matches "app.saved.amount"`,
    `Then "input#amount" value contains "app.saved.amount"`,
  ],
})

/**
 * Compares a selected elements property against a saved value
 */
Then(
  '{string} {word} matches {string}',
  (sel, prop, type, wPath, world) => compareToWorldValue(sel, prop, `matches-world`, wPath, world),
  elToWorldMeta
)
Then(
  '{string} {word} contains {string}',
  (sel, prop, type, wPath, world) => compareToWorldValue(sel, prop, `contains-world`, wPath, world),
  elToWorldMeta
)

const worldToElMeta = deepMerge(metaBase, {
  ...metaBase,
  examples: [
    `Then "3" matches "input#amount" value`,
    `Then "app.saved.amount" matches "input#amount" value`,
    `Then "app.saved.amount" contains "input#amount" value`,
  ],
  expressions: [
    {
      type: 'string',
      example: 'context.selected',
      description: `Path on the world where the saved data exists`,
    },
    ...metaBase.expressions
  ]
})

/**
 * Compares a saved value against a selected elements property
 */
Then(
  '{string} matches {string} {word}',
  (wPath, type, sel, prop, world) => compareToWorldValue(sel, prop, `matches-el`, wPath, world),
  worldToElMeta
)
Then(
  '{string} contains {string} {word}',
  (wPath, type, sel, prop, world) => compareToWorldValue(sel, prop, `contains-el`, wPath, world),
  worldToElMeta
)

/**
 * Compares a selected elements property against a saved elements property
 */

const elementMeta = deepMerge(metaBase, {
  examples: [
    `Then "input#amount" value contains saved`,
    `Then "input#amount" value matches saved`
  ]
})

const elementMetaNoProp = deepMerge(metaBase, {
  examples: [
    `Then "input#amount" value contains "context.selected"`,
    `Then "input#amount" value matches "context.selected"`,
  ],
  expressions: [{
    type: 'string',
    description: `Path on the world where the saved element exists`,
    example: 'context.selected',
  }]
})

const elementMetaProp = deepMerge(metaBase, {
  examples: [
    `Then "input#amount" value contains "context.selected" value`,
    `Then "input#amount" value matches "context.selected" value`,
  ],
  expressions: [
    {
      type: 'string',
      description: `Path on the world where the saved element exists`,
      example: 'context.selected',
    },
    {
      type: 'string',
      description: `The property of the saved element to compare`,
      example: 'value',
    }
  ]
})

// Compare with prop selected element to world saved element
Then(
  '{string} {word} matches saved',
  (sel, prop, world) => compareElements(sel, prop, `matches-world`, `__meta.savedElement`, prop, world),
  elementMeta
)
Then(
  '{string} {word} contains saved',
  (sel, prop, world) => compareElements(sel, prop, `contains-world`, `__meta.savedElement`, prop, world),
  elementMeta
)

// Compare with prop world saved element to selected element
Then(
  'saved matches {string} {word}',
  (sel, prop, world) => compareElements(sel, prop, `matches-el`, `__meta.savedElement`, prop, world),
  elementMeta
)
Then(
  'saved contains {string} {word}',
  (sel, prop, world) => compareElements(sel, prop, `contains-el`, `__meta.savedElement`, prop, world),
  elementMeta
)


// Compare with prop selected element to world path element
Then(
  '{string} {word} matches {string}',
  (sel, prop, wPath, world) =>  compareElements(sel, prop, `matches-world`, wPath, prop, world),
  elementMetaNoProp
)
Then(
  '{string} {word} contains {string}',
  (sel, prop, wPath, world) =>  compareElements(sel, prop, `contains-world`, wPath, prop, world),
  elementMetaNoProp
)
Then(
  '{string} {word} matches {string} {word}',
  (sel, prop, ...args) =>  compareElements(sel, prop, `matches-world`, ...args),
  elementMetaProp
)
Then(
  '{string} {word} contains {string} {word}',
  (sel, prop, ...args) =>  compareElements(sel, prop, `contains-world`, ...args),
  elementMetaProp
)


// Compare with prop world path element to selected element
Then(
  '{string} matches {string} {word}',
  (wPath, sel, prop, world) =>  compareElements(sel, prop, `matches-world`, wPath, prop, world),
  elementMetaNoProp
)
Then(
  '{string} contains {string} {word}',
  (wPath, sel, prop, world) =>  compareElements(sel, prop, `contains-world`, wPath, prop, world),
  elementMetaNoProp
)
Then(
  '{string} {word} matches element {string} {word}',
  (wPath, wProp, sel, prop, world) =>  compareElements(sel, prop, `matches-el`, wPath, wProp, world),
  compareElements,
  elementMetaProp
)
Then(
  '{string} {word} contains element {string} {word}',
  (wPath, wProp, sel, prop, world) =>  compareElements(sel, prop, `contains-el`, wPath, wProp, world),
  compareElements,
  elementMetaProp
)



module.exports = {
  compareElements,
  compareToWorldValue
}

