const { isObj, noOpObj, noPropArr, } = require('@keg-hub/jsutils')
const { getWorld } = require('HerkinSupport/world')
const { getFileTypes } = require('HerkinShared/utils/getFileTypes')
const {
  getUserRepos,
  statusHerkin,
  initializeHerkin,
  disconnectHerkin,
} = require('HerkinWF')

/**
 * Class variation of the a herkin config
 * Has the same properties as a Herkin Config object, but includes some helper methods
 */
class Repo {

  /**
   * Gets all repos for a user, including each repos branches
   * The filters them out based on exists
   * @param {Object} opts - Options for make API query to Provider
   * @param {string} opts.token - Provider Token for making authenticated API calls
   * 
   * @returns {Array} - Found repos and their branches
   */
  static getUserRepos = async opts => {
    const repos = await getUserRepos({...opts, loadMocks: true})

    return repos.filter(repo => isObj(repo))
      .map(repo => {
        const { refs, url, name } = repo
        return !refs || !refs.nodes || !refs.nodes.length
          ? {url, name, branches: noPropArr}
          : {
              url,
              name,
              branches: refs.nodes.map(branch => branch.name).filter(name => name)
            }
      })
  }

  /**
   * Gathers metadata and creates a Repo Model object of a mounted / connected
   * @param {Object} config - Herkin global App Config, NOT A REPO CONFIG
   * @param {Object} [repoData] - Past metadata stored about the repo on the frontend
   *
   * @returns {Object} - Repo Model object built by the response of the statusHerkin workflow
   */
  static status = async (config, repoData) => {
    const { repo, ...status } = await statusHerkin(config, repoData, false)

    return !repo || !status.mounted
      ? { status }
      : { status, repo: new Repo(repo) }
  }

  /**
   * Disconnects a previously connected repo
   * @param {Object} args - Arguments for disconnecting a repo
   * @param {string} args.username - Name of the user that mounted the repo
   *
   * @returns {Object} - Response from the disconnectHerkin workflow
   */
  static disconnect = async ({ username }) => {
    return await disconnectHerkin({
      user: {
        gitUser: username,
      },
    })
  }

  /**
   * Creates a Repo Class instance by connecting to an external git repo
   * @param {Object} args - Arguments for connecting a repo
   *
   * @returns {Object} - Response from the initializeHerkin workflow
   */
  static fromWorkflow = async ({ repoUrl, branch, createBranch, username, token }) => {
    const url = new URL(repoUrl)
    const name = url.pathname.split('/').pop().replace('.git', '')
    const provider = url.host.split('.').slice(0).join('.')

    const resp = await initializeHerkin({
      repo: {
        name,
        token,
        branch,
        provider,
        createBranch,
        url: repoUrl,
      },
      user: { gitUser: username },
    })

    if (!resp || !resp.mounted)
      throw new Error(
        `[ERROR] Could not mount repo ${repoUrl}.\n${resp ? resp.message : ''}`
      )

    return new Repo({
      ...resp.repo,
    })
  }

  /**
   * World object for the repo
   * Get's loaded when the instance is created
   * @memberOf Repo
   * @type {Object}
   */
  world = undefined

  /**
   * Paths object for the repo
   * Locations of the repo files on the host file system
   * @memberOf Repo
   * @type {Object}
   */
  paths = undefined

  /**
   * Git metadata for the repo
   * Containing local / remote paths, and user / provider information
   * @memberOf Repo
   * @type {Object}
   */
  git = undefined

  // Property to define a valid herkin config object
  __VALID_HERKIN_CONFIG = true

  constructor(config = noOpObj) {
    const { paths, git, name } = config
    this.git = git
    this.name = name
    this.paths = paths
    this.world = getWorld(config)
    this.fileTypes = getFileTypes(this.paths.repoRoot, this.paths)
  }

  /**
   * Reloads the world object for the repo
   * @memberOf Repo
   * @type {function}
   *
   * @return {Object} - The reloaded repo.world object
   */
  refreshWorld = async () => {
    this.world = getWorld(this)

    return this.world
  }
}

module.exports = {
  Repo,
}
