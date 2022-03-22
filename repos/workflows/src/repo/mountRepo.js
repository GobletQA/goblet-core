const { gitfs } = require('../gitfs')

/**
 *
 * Uses gitfs to mount a repo to the local instance
 * gitfs http://your.com/repository.git /mount/directory
 * gitfs -o log=/var/log/gitfs.log,debug=true,foreground=true,commiter_name=foo_user,commiter_email=foo_user@whatever.com,user=www-data,group=www-data,username=foo_user,password=boo_password https://github.com/foo_user/my_git_project.git /var/mount/whatever_dir
 *
 */

/**
 * Workflow for cloning a git repo from a git provider
 * @function
 * @public
 * @throws
 * @param {Object} args - Data needed to execute the workflow
 *
 * @returns {Void}
 */
const mountRepo = async args => {
  const [err, output] = await gitfs(args)

  if (err) throw new Error(err)
  if (output)
    throw new Error(
      `Could not mount repository. Check the log file at ${
        args.log || '/var/log/gitfs.log'
      }`
    )
}

module.exports = {
  mountRepo,
}
