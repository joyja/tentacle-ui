import gql from 'graphql-tag'
import fragment from './fragment'

const user = gql`
  query User {
    user {
      id
      username
    }
  }
`

const tags = gql`
  query Tags {
    tags {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

export default {
  user,
  tags
}
