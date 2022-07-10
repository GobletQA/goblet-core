const { upsertTestMeta } = require('GobletTest/testMeta/testMeta')

/**
 * Checks if the context was recording a video
 * Then updates the testMeta with the path to the video
 */
const saveRecordingPath = async () => {  
  const {dir, ...recordVideo} = get(global, `__goblet.context.options.recordVideo`, {})
  if(!dir) return

  const { testType } = get(global, `__goblet.options`, {})
  testType &&
    await upsertTestMeta(`${testType}.recording`, {
      ...recordVideo,
      path: recordVideoDir
    })
}

module.exports = {
  saveRecordingPath
}