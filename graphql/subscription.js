import gql from 'graphql-tag'
import fragment from './fragment'

const tagUpdate = gql`
  subscription TagUpdate {
    tagUpdate {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

export default {
  tagUpdate
}
