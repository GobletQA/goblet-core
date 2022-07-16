/*
 * [General Information](https://commitlint.js.org/)
 * Allowed scopes, must be one of
 * build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
 *
 * Commit messages should follow the following format
 * <type>[optional scope]: <description>
 * [optional body]
 * [optional footer(s)]
 *
 * [See here for spec](https://www.conventionalcommits.org/en/v1.0.0/)
 *
 * @example - Example of a valid commit message for changes to the components sub-repo
 * fix(components): Added new Text component  -  // Header
 * Add a Text component to normalize displaying text content  -  // Body - can be multiline
 *
 * @example - Example of a valid commit message for changes to the root repo files
 * docs: Updated README.md with more information  -  // Header only
 *
 * @example - Example of a valid commit message for changes to multiple scopes with breaking changes
 * build(repos): Rebuild all sub-repos  -  // Header
 * Rebuilt all sub-repos to prep for deployment  -  // Body - can be multiline
 * BREAKING CHANGE: New builds contain breaking changes  -  // Footer - contains semver breaking change info
 *
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // [Rules Reference](https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md)
  rules: {
    // Disable lower-case only text in commit message header and body
    'scope-case': [0],
    'subject-case': [0],
    // Allow commit messages with an empty body, i.e. header only
    'subject-empty': [0],
  },
}
