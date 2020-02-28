import gql from 'graphql-tag'

const user = gql`
  query User {
    user {
      id
      username
    }
  }
`

export default {
  user
}
