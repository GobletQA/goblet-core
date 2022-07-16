import { Values } from 'HKConstants'
const { CATEGORIES } = Values

/**
 * Sets default repos to the store
 * When in development, will pre-load repos
 * @type {Object}
 *
 * @returns {void}
 */
export const repos = {
  [CATEGORIES.PROVIDER_REPOS]: [],
}
