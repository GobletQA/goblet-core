// TODO: @lance-tipton - Move all socket.io setup and files to screencast folder
const { Repo } = require('@gobletqa/shared/repo/repo')
const { joinBrowserConf } = require('@gobletqa/shared/utils/joinBrowserConf')
const {
  setPage,
  stopBrowser,
  startPlaying,
} = require('@gobletqa/screencast/libs/playwright')

const handleStartPlaying = async (data, repo, socket, Manager, app) => {
  const { token, ref, action, ...browser } = data
  const browserConf = joinBrowserConf(browser, app)
  const player = await startPlaying({
    repo,
    action,
    browserConf,
    id: socket.id,
    onPlayEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async closeBrowser => {
      closeBrowser && await stopBrowser(browserConf)
    },
    onCreateNewPage: async page => {
      page && await setPage(page)
    },
  })

  Manager.cache[socket.id].player = player
}

const browserRunTests = app => {
  return async ({ data, socket, config, Manager, io }, tokenData) => {
    const { iat, exp, ...user } = tokenData
    const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    await repo.refreshWorld()

    await handleStartPlaying(data, repo, socket, Manager, app)
  }
}

module.exports = {
  browserRunTests,
}
