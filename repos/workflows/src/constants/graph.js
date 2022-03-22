
const { deepFreeze } = require('@keg-hub/jsutils')



/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @type {Object}
 * @readonly
 */
module.exports = deepFreeze({
  GRAPH: {
    OPTS: {
      AFFILIATIONS: [
        'OWNER',
        'COLLABORATOR',
        'ORGANIZATION_MEMBER'
      ],
      SORT_DIRECTION: {
        ASC: 'ASC',
      }
    },
    ENDPOINTS: {
      REPO: {
        LIST_ALL: {
          KEY: 'repos.listAll',
          DATA_PATH: 'viewer.repositories',
          /**
           * GraphQL Queries relative to the GraphQL endpoints
           * @type {string}
           * @readonly
           */
          QUERY: `query($first: Int!, $after: String, $affiliations: [RepositoryAffiliation], $ownerAffiliations: [RepositoryAffiliation], $sortDirection: OrderDirection!)
          {
            viewer {
              repositories(first: $first, after: $after, affiliations: $affiliations, ownerAffiliations: $ownerAffiliations, orderBy: {field: NAME, direction: $sortDirection}, isFork: false) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                nodes{
                  url
                  name
                  refs(first: $first, refPrefix:"refs/heads/") {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }`
        },
        BRANCHES: {},
      },
    },
  }
})