const htmlRes = (req, res, html, status) => {
  return res
    .status(status || 200)
    .set('Content-Type', 'text/html')
    .send(html)
}

module.exports = {
  htmlRes,
}
