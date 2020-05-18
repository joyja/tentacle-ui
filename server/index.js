const { loadNuxt, build } = require('nuxt')

const isDev = process.env.NODE_ENV !== 'production'

const startServer = function () {
  const nuxt = loadNuxt(isDev ? 'dev' : 'start')

  if (isDev) {
    build(nuxt)
  }
}

module.exports = {
  startServer,
}
