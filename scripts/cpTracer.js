const path = require('path')
const { promises } = require('fs')
const { limbo } = require('@keg-hub/jsutils')
const { fileSys, Logger } = require('@keg-hub/cli-utils')
const { pathExists } = fileSys

/**
 * Header string to remove from the tracer
 * This is brittle, there's probably a better way to do this
 * May need to update as new versions are pushed
 */
const tracerHeaderJS = `I("div",{className:"hbox header",children:[g("div",{className:"logo",children:"\u{1F3AD}"}),g("div",{className:"product",children:"Playwright"}),i.title&&g("div",{className:"title",children:i.title}),g("div",{className:"spacer"})]}),`

const rootDir = path.join(__dirname, '../')
const copyToLoc = path.join(rootDir, 'repos/traceViewer')
const traceViewerLoc = path.join(rootDir, `node_modules`, 'playwright-core/lib/webpack/traceViewer')

const exitErr = (...msgs) => {
  Logger.log([
    Logger.colors.red(`[ ERROR ] ${msgs.shift()}`),
    msgs.join(`\n`),
    `\n`
  ].join(' '))
  process.exit(1)
}

const findMainBundle = async () => {
  const [findErr, files] = await limbo(promises.readdir(copyToLoc))
  findErr && exitErr(`Error looking for Trace View main.*.js bundle\n`, cpErr.stack)

  for (const file of files) {
    const name = path.basename(file)
    if(name.startsWith(`main.`) && name.endsWith(`.js`))
      return path.join(copyToLoc, file)
  }

  exitErr(`Could not find main.*.js bundle\n`, Logger.colors.yellow(`Found files:\n`), ...files)
}

const replacePWHeader = async () => {
  const bundleLoc = await findMainBundle()
  Logger.pair(`Found main.*.js bundle -`, bundleLoc)

  const [readErr, content] = await limbo(promises.readFile(bundleLoc))
  readErr && exitErr(`Error reading main.*.js content\n`, readErr.stack)

  Logger.log(`Replacing header in main.*.js bundle...`)
  const replaced = content.toString().replace(tracerHeaderJS, ``)

  const [writeErr] = await limbo(promises.writeFile(bundleLoc, replaced))
  writeErr && exitErr(`Error writing updated main.*.js content\n`, writeErr.stack)
}


const copyTraceViewerDir = async () => {
  const [existErr] = await pathExists(traceViewerLoc)
  existErr && exitErr(`PW Trace Viewer folder does not exist in the currently installed version of playwright!`)

  Logger.log(`Copying tracerViewer from playwright-core...`)
  const copyOpts = { force: true, recursive: true }
  const [cpErr] = await limbo(promises.cp(traceViewerLoc, copyToLoc, copyOpts))
  cpErr && exitErr(`Could not copy Trace Viewer folder\n`, cpErr.stack)
}



;(async () => {
  await copyTraceViewerDir()
  await replacePWHeader()
})()
