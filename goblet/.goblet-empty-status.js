/**
 *
 * **DO NOT DELETE** - This is used in the statusGoblet workflow
 * If this file exists, then a volume mount does not exist
 * Otherwise it would overwrite this file
 *
 */

module.exports = {
  mode: `local`,
  mounted: false,
  status: `unmounted`,
  location: __dirname,
  message: `Repo volume mount does not exist`,
}
