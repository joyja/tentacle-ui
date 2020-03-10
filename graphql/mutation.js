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

const createScanClass = gql`
  mutation CreateScanClass($name: String!, $description: String!, $rate: Int!) {
    createScanClass(name: $name, description: $description, rate: $rate) {
      ...ScanClassBasic
    }
  }
  ${fragment.scanClass}
`

const updateScanClass = gql`
  mutation UpdateScanClass(
    $id: ID!
    $name: String!
    $description: String!
    $rate: Int!
  ) {
    updateScanClass(
      id: $id
      name: $name
      description: $description
      rate: $rate
    ) {
      ...ScanClassBasic
    }
  }
  ${fragment.scanClass}
`

const deleteScanClass = gql`
  mutation DeleteScanClass($id: ID!) {
    deleteScanClass(id: $id) {
      ...ScanClassBasic
    }
  }
  ${fragment.scanClass}
`

const createTag = gql`
  mutation CreateTag(
    $name: String!
    $description: String!
    $value: String!
    $datatype: Datatype!
    $scanClassId: ID!
  ) {
    createTag(
      name: $name
      description: $description
      value: $value
      datatype: $datatype
      scanClassId: $scanClassId
    ) {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

const updateTag = gql`
  mutation UpdateTag(
    $id: ID!
    $name: String!
    $description: String!
    $value: String!
    $datatype: Datatype!
    $scanClassId: ID!
  ) {
    updateTag(
      id: $id
      name: $name
      description: $description
      value: $value
      datatype: $datatype
      scanClassId: $scanClassId
    ) {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

const deleteTag = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

export default {
  login,
  changePassword,
  createScanClass,
  updateScanClass,
  deleteScanClass,
  createTag,
  updateTag,
  deleteTag
}
