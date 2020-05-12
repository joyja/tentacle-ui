import graphql from '~/graphql'

export default function ({ app, store, redirect }) {
  if (!app.$apolloHelpers.getToken()) {
    return redirect('/login')
  } else {
    const client = app.apolloProvider.defaultClient
    return client
      .query({
        query: graphql.query.user,
      })
      .then((result) => {
        if (!result.data.user) {
          return redirect('/login')
        }
      })
      .catch(() => {
        return redirect('/login')
      })
  }
}
