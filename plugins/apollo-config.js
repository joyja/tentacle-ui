import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'
import fragmentTypes from '~/fragmentTypes.json'
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes
})
export default function(context) {
  const httpPrefix = process.env.TENTACLE_SECURE ? 'https' : 'http'
  const wsPrefix = process.env.TENTACLE_SECURE ? 'wss' : 'ws'
  const hostname =
    process.env.TENTACLE_HOST || process.client
      ? window.location.hostname
      : 'localhost'
  const port = process.env.TENTACLE_PORT || 4000
  return {
    httpEndpoint: `${httpPrefix}://${hostname}:${port}/`,
    wsEndpoint: `${wsPrefix}://${hostname}:${port}/`,
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
