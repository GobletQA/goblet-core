window.__gobletTest = window.__gobletTest || {}

const recordingOptions = {
  highlightStyles: {
    position: 'absolute',
    zIndex: '2147483640',
    background: '#f005',
    pointerEvents: 'none',
  }
}

window.isGobletRecording = () => {
  return true
}

window.getGobletRecordOption = (option) => {
  return recordingOptions[option]
}

window.gobletRecordAction = (event) => {
  console.log(event.target, event.element)
}