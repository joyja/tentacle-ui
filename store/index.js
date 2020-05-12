import graphql from '~/graphql'
export const state = () => ({
  user: null,
})

export const mutations = {
  setState(state, { key, moduleName, value }) {
    if (key) {
      if (!moduleName) {
        state[key] = value
      } else {
        state[moduleName][key] = value
      }
    } else {
      throw new Error('You need to specify a state key to use setState.')
    }
  },
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    const client = app.apolloProvider.defaultClient
    const result = await client
      .query({
        query: graphql.query.user,
      })
      .catch(() => {
        commit('setState', { key: 'user', value: null })
      })
    if (result && result.data) {
      commit('setState', {
        key: 'user',
        value: result.data.user,
      })
    } else {
      commit('setState', {
        key: 'user',
        value: null,
      })
    }
  },
}
