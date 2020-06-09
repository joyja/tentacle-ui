import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import getFragmentTypes from '../getFragmentTypes'

export default async function (context) {
  const fragmentTypes = await getFragmentTypes()
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: fragmentTypes,
  })
  let config = {}
  if (process.client) {
    config = {
      httpPrefix: process.env.tentacleClientSecure ? 'https' : 'http',
      wsPrefix: process.env.tentacleClientSecure ? 'wss' : 'ws',
      hostname: process.env.tentacleClientHost || window.location.hostname,
      port: process.env.tentacleClientPort || window.location.port,
      url: process.env.tentacleClientUrl || '/api/',
    }
  } else {
    config = {
      httpPrefix: process.env.tentacleServerSecure ? 'https' : 'http',
      wsPrefix: process.env.tentacleServerSecure ? 'wss' : 'ws',
      hostname: process.env.tentacleServerHost || 'localhost',
      port: process.env.tentacleServerPort || 4000,
      url: process.env.tentacleServerUrl || '/',
    }
  }
  const portString = config.port ? `:${config.port}` : ``
  return {
    httpEndpoint: `${config.httpPrefix}://${config.hostname}${portString}${config.url}`,
    wsEndpoint: `${config.wsPrefix}://${config.hostname}${portString}${config.url}`,
    cache: new InMemoryCache({ fragmentMatcher }),
  }
}
