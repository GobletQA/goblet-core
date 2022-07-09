const { execSync } = require('child_process')
const host = process.env.KEG_PROXY_HOST || 'local.kegdev.xyz'

module.exports.getGobletUrl = () => {
  let branchName
  try {
    branchName = execSync(`git -C ${__dirname} branch --show-current`)
      .toString()
      .trim()
  } catch (err) {
    console.log(err.stack)
    branchName = 'master'
  }

  return `http://goblet-${branchName}.${host}`
}
