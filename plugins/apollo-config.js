import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import fragmentTypes from '~/fragmentTypes.json'
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
})
export default function (context) {
  const defaultHostname = process.client
    ? window.location.hostname
    : 'localhost'
  const httpPrefix = process.env.tentacleSecure ? 'https' : 'http'
  const wsPrefix = process.env.tentacleSecure ? 'wss' : 'ws'
  const hostname = process.env.tentacleHost || defaultHostname
  const port = process.env.tentaclePort
  const url = process.env.tentacleUrl
  return {
    httpEndpoint: `${httpPrefix}://${hostname}:${port}/${url}`,
    wsEndpoint: `${wsPrefix}://${hostname}:${port}/${url}`,
    cache: new InMemoryCache({ fragmentMatcher }),
  }
}
