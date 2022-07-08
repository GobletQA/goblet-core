/**
 * Script gets appended on to reports loaded as HTML
 * Uses postMessage to allow sending it's height
 * Which allows the ui to display the report properly
 * The postMessage event only fires if loaded in an iframe
 * Look at `repos/backend/utils/getTestReportHtml.js` to see how it's appended
 */

const injectScript = () => {
  // Only execute if inside an iframe
  if (window.parent === window) return
  // Message to set the correct IFrame height
  window.parent.postMessage(
    { gobletIframeHeight: document.body.scrollHeight },
    '*'
  )
  // Helper to let the parent know when the iframe was clicked
  window.addEventListener('click', evt => {
    window.parent.postMessage({ gobletIframeClick: true }, '*')
  })
}

const reportHeight = `
<script>
  (${injectScript.toString()})()
</script>
`

module.exports = {
  reportHeight,
}
