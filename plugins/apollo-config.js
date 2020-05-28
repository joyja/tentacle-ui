import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import fragmentTypes from '~/fragmentTypes.json'
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
})

export default function (context) {
  const clientConfig = {
    httpPrefix: process.env.tentacleClientSecure ? 'https' : 'http',
    wsPrefix: process.env.tentacleClientSecure ? 'wss' : 'ws',
    hostname: process.env.tentacleClientHost || window.location.hostname,
    port: process.env.tentacleClientPort || '80',
    url: process.env.tentacleClientUrl || '/api/',
  }
  const serverConfig = {
    httpPrefix: process.env.tentacleServerSecure ? 'https' : 'http',
    wsPrefix: process.env.tentacleServerSecure ? 'wss' : 'ws',
    hostname: process.env.tentacleServerHost || 'localhost',
    port: process.env.tentacleServerPort || 4000,
    url: process.env.tentacleServerUrl || '/',
  }
  const config = process.client ? clientConfig : serverConfig
  return {
    httpEndpoint: `${config.httpPrefix}://${config.hostname}:${config.port}/${config.url}`,
    wsEndpoint: `${config.wsPrefix}://${config.hostname}:${config.port}/${config.url}`,
    cache: new InMemoryCache({ fragmentMatcher }),
  }
}
