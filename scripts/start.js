#!/usr/bin/env node
const path = require('path')
const { loadNuxt } = require('nuxt-start')

const main = async () => {
  const nuxt = await loadNuxt({
    rootDir: path.join(__dirname, '../'),
    for: 'start',
  })
  await nuxt.listen(3000)
}

main()
