import { Values } from 'HKConstants'
const { CATEGORIES } = Values

const providerRepos = process.env.NODE_ENV !== 'development'
  ? {}
  : [
      {
        name: "workflows-test",
        url: "https://github.com/lancetipton/workflows-test",
        branches: [
          { name: 'main' },
          { name: 'workflows-test' },
        ]
      },
      {
        name: "tap-proxy",
        url: "https://github.com/lancetipton/tap-proxy",
        branches: [
          { name: 'main' },
          { name: 'tap-proxy' },
        ]
      },
      {
        name: "tap-assets",
        url: "https://github.com/lancetipton/tap-assets",
        branches: [
          { name: 'main' },
          { name: 'tap-assets' },
        ]
      },
      {
        name: "sockr",
        url: "https://github.com/lancetipton/sockr",
        branches: [
          { name: 'main' },
          { name: 'lancetipton/sockr' },
        ]
      },
      {
        name: "rga4",
        url: "https://github.com/lancetipton/rga4",
        branches: [
          { name: 'main' },
          { name: 'lancetipton/rga4' },
        ]
      },
      {
        name: "parkin",
        url: "https://github.com/lancetipton/parkin",
        branches: [
          { name: 'main' },
          { name: 'lancetipton/parkin' },
        ]
      },
      {
        name: "notes",
        url: "https://github.com/lancetipton/notes",
        branches: [
          { name: 'main' },
          { name: 'lancetipton/notes' },
        ]
      },
      {
        name: "keg-hub",
        url: "https://github.com/KegHub/keg-hub",
        branches: [
          { name: 'main' },
          { name: 'keg-hub' },
        ]
      },
      {
        name: "keg-herkin",
        url: "https://github.com/KegHub/keg-herkin",
        branches: [
          { name: 'main' },
          { name: 'keg-herkin' },
        ]
      },
      {
        name: "keg-git",
        url: "https://github.com/lancetipton/keg-git",
        branches: [
          { name: 'main' },
          { name: 'keg-git' },
        ]
      },
    ]


    
/**
 * Sets default repos to the store
 * When in development, will pre-load repos
 * @type {Object}
 *
 * @returns {void}
 */
export const repos = {
  // [CATEGORIES.PROVIDER_REPOS]: providerRepos,
  [CATEGORIES.PROVIDER_REPOS]: [],
}
