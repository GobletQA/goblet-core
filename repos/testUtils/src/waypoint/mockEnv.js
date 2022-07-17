if(process.env.GOBLET_MOCK_TEST_ENV){

  /**
  * This mocks out the default node packages, and the global process
  */
  // global.process = {}
  const noOp = () => {}
  process.env = {}
  process.channel = {}
  process.argv = []
  process.abort = noOp
  process.cwd = noOp
  process.chdir = noOp
  process.dlopen = noOp
  process.emitWarning = noOp
  process.emit = noOp
  process.exit = noOp
  process.getActiveResourcesInfo = noOp
  process.getgid = noOp
  process.getgroups = noOp
  process.geteuid = noOp
  process.getuid = noOp
  process.getegid = noOp
  process.hasUncaughtExceptionCaptureCallback = noOp
  process.hrtime = noOp
  process.initgroups = noOp
  process.kill = noOp
  process.memoryUsage = noOp
  process.on = noOp
  process.nextTick = noOp
  process.resourceUsage = noOp
  process.send = noOp
  process.setegid = noOp
  process.seteuid = noOp
  process.setSourceMapsEnabled = noOp
  process.setUncaughtExceptionCaptureCallback = noOp
  process.setgid = noOp
  process.setgroups = noOp
  process.setuid = noOp
  process.umask = noOp
  process.uptime = noOp


  // To polyfill with save versions

  jest.setMock('path', {})
  jest.setMock('async_hooks', {})
  jest.setMock('buffer', {})
  jest.setMock('child_process', {})
  jest.setMock('cluster', {})
  jest.setMock('crypto', {})
  jest.setMock('diagnostics_channel', {})
  jest.setMock('dns', {})
  jest.setMock('domain', {})
  jest.setMock('dgram', {})
  jest.setMock('fs', {})
  jest.setMock('http', {})
  jest.setMock('http2', {})
  jest.setMock('https', {})
  jest.setMock('inspector', {})
  jest.setMock('net', {})
  jest.setMock('punycode', {})
  jest.setMock('querystring', {})
  jest.setMock('node:readline', {})
  jest.setMock('repl', {})
  jest.setMock('stream', {})
  jest.setMock('string_decoder', {})
  jest.setMock('tls', {})
  jest.setMock('trace_events', {})
  jest.setMock('tty', {})
  jest.setMock('util', {})
  jest.setMock('v8', {})
  jest.setMock('vm', {})
  jest.setMock('worker_threads', {})
  jest.useFakeTimers()
  jest.setMock('os', {
    homedir: () => global.__goblet.paths.repoRoot
  })

}
