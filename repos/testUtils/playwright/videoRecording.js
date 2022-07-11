const fs = require('fs')
const path = require('path')
const { noOpObj, get } = require('@keg-hub/jsutils')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { getGeneratedName } = require('./getGeneratedName')
const { upsertTestMeta } = require('GobletTest/testMeta/testMeta')
const { movePath, getFolderContent } = fileSys
const { rename } = fs.promises

/**
 * Uses the passed in Playwright page to get the video path from
 * If no page is passed it searches the record directory for the most recent recording
 * @param {Object} page - Playwright page to get the video path from
 * @param {string} recordDir - Path to where the videos are recorded
 *
 * @returns {string} - Location of the most recently saved video recording
 */
const getRecordingPath = async (page, recordDir) => {
  if(page){
    const video =  page.video()
    return await video.path()
  }

  const files = await getFolderContent(recordDir, {
    full: true,
    exclude: [],
    recursive: false,
  })

  return files.map(file => ({ file, ctimeMs: fs.statSync(file).ctimeMs }))
    .sort((a, b) => a.ctimeMs - b.ctimeMs)
    .pop()
    .file
}

/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 * @param {Object} page - Playwright page to get the video path from
 *
 */
const saveRecordingPath = async (page) => {  
  const { testType } = get(global, `__goblet.options`, noOpObj)
  const recordVideo = get(global, `__goblet.context.options.recordVideo`, noOpObj)
  if(!recordVideo.dir) return

  const { name, relative } = getGeneratedName()

  const recordPath = await getRecordingPath(page, recordVideo.dir)

  if(!recordPath){
    Logger.warn(`The video record path for test ${name} does not exist in directory ${recordVideo.dir}`)
    return
  }

  const savePath = path.join(recordVideo.dir, `${relative}${path.extname(recordPath)}`, )
  const [err, result] = await movePath(recordPath, savePath)
  if(err) throw err
  console.log(`------- result -------`)
  console.log(result)

  testType &&
    await upsertTestMeta(`${testType}.recording`, {
      ...recordVideo,
      path: savePath,
    })
}

module.exports = {
  saveRecordingPath
}
