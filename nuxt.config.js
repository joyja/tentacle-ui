import colors from 'vuetify/es5/util/colors'

export default {
  hooks: {
    build: {
      analyze: true,
    },
  },
  env: {
    tentacleServerSecure: process.env.TENTACLE_SERVER_SECURE || false,
    tentacleServerHost: process.env.TENTACLE_SERVER_HOST,
    tentacleServerPort: process.env.TENTACLE_SERVER_PORT || 4000,
    tentacleServerUrl: process.env.TENTACLE_SERVER_URL,
    tentacleClientSecure: process.env.TENTACLE_CLIENT_SECURE || false,
    tentacleClientHost: process.env.TENTACLE_CLIENT_HOST,
    tentacleClientPort: process.env.TENTACLE_CLIENT_PORT,
    tentacleClientUrl: process.env.TENTACLE_CLIENT_URL,
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: 'entacle - %s',
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/apollo'],
  /*
   ** apollo module configuration
   ** https://github.com/nuxt-community/apollo-module
   */
  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo-config.js',
    },
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: colors.blueGrey.base,
          accent: colors.orange.darken2,
          secondary: colors.blueGrey.darken2,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ]
      },
    },
    extend(config, ctx) {},
  },
}
