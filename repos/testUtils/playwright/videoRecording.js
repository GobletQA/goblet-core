const fs = require('fs')
const path = require('path')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { getGeneratedName } = require('./getGeneratedName')
const { noOpObj, get, wait } = require('@keg-hub/jsutils')
const { appendToLatest } = require('GobletTest/testMeta/testMeta')
const { mkDir, movePath, getFolderContent, pathExists } = fileSys

/**
 * Uses the passed in Playwright page to get the video path
 * Then check if the path exists, and returns
 * If no file found, then calls its self recursively 3 until it does
 */
const pathFromPageVideo = async (page, videoPath, checks=0) => {

  // If no video path, this is the first call to the method
  if(!videoPath){
    const video =  page.video()
    videoPath = video && await video.path()
  }

  // If still no video path after pull from page, then return
  // Should only happen on the first call
  if(!videoPath) return

  // Ensure the path exists
  // It takes a bit for the video to be created even when we have the path
  // So we have to validate it exist
  const videoExists = await pathExists(videoPath)
  // If the video exists, we can now return the path
  if(videoPath && videoExists) return videoPath

  // Limit the amount of recursive calls to avoid un-forseen forever loops
  if(checks >= 2) return

  // Wait for half a second and try again
  await wait(500)
  return pathFromPageVideo(page, videoPath, checks++)
}

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
    const videoPath = await pathFromPageVideo(page)
    if(videoPath) return videoPath
  }

  // If no video path, try to find the most recent file
  // Looks at the create time for all file in the record folder
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
  const { type:browser=`browser` } = get(global, `__goblet.browser.options`, noOpObj)
  const recordVideo = get(global, `__goblet.context.options.recordVideo`, noOpObj)

  if(!recordVideo.dir) return

  // TODO: update to use video.saveAs(path)
  const recordPath = await getRecordingPath(page, recordVideo.dir)
  if(!recordPath)
    return Logger.warn(
      `The video record path for test ${name} does not exist in directory ${recordVideo.dir}`
    )

  // Ensure the test sub-folder exists
  const { name, dir, nameTimestamp } = getGeneratedName()
  const saveDir = path.join(recordVideo.dir, dir)
  const [mkErr, resp] = await mkDir(saveDir)
  if(mkErr) throw mkErr

  // TODO: update to use video.saveAs(path)
  const savePath = path.join(saveDir, `${nameTimestamp}${path.extname(recordPath)}`)
  const [mvErr] = await movePath(recordPath, savePath)

  if(mvErr) throw mvErr

  testType &&
    await appendToLatest(`${testType}.recordings.${browser}.${name}`, {
      ...recordVideo,
      path: savePath,
    }, true)
}

module.exports = {
  saveRecordingPath
}
