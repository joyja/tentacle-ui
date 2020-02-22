import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'
import schema from '~/schema.json'
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema
})
export default function(context) {
  return {
    httpEndpoint: process.client
      ? `http://${window.location.hostname}:4000/`
      : `http://localhost:4000`,
    wsEndpoint: process.client
      ? `ws://${window.location.hostname}:4000/`
      : `ws://localhost:4000`,
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
