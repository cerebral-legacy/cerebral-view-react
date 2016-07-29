function cleanPath (path) {
  return path.replace(/\.\*\*|\.\*/, '')
}

module.exports = cleanPath
