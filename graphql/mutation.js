import gql from 'graphql-tag'
import fragment from './fragment'

const login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        ...UserBasic
      }
    }
  }
  ${fragment.user}
`

const changePassword = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      ...UserBasic
    }
  }
  ${fragment.user}
`

export default {
  login,
  changePassword
}
