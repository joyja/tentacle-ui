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

const createModbus = gql`
  mutation CreateModbus(
    $name: String!
    $description: String!
    $host: String!
    $port: Int!
    $reverseBits: Boolean!
    $reverseWords: Boolean!
    $zeroBased: Boolean!
    $timeout: Int!
    $retryRate: Int!
  ) {
    createModbus(
      name: $name
      description: $description
      host: $host
      port: $port
      reverseBits: $reverseBits
      reverseWords: $reverseWords
      zeroBased: $zeroBased
      timeout: $timeout
      retryRate: $retryRate
    ) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const updateModbus = gql`
  mutation UpdateModbus(
    $id: ID!
    $name: String
    $description: String
    $host: String
    $port: Int
    $reverseBits: Boolean
    $reverseWords: Boolean
    $zeroBased: Boolean
    $timeout: Int
    $retryRate: Int
  ) {
    updateModbus(
      id: $id
      name: $name
      description: $description
      host: $host
      port: $port
      reverseBits: $reverseBits
      reverseWords: $reverseWords
      zeroBased: $zeroBased
      timeout: $timeout
      retryRate: $retryRate
    ) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const deleteModbus = gql`
  mutation DeleteModbus($id: ID!) {
    deleteModbus(id: $id) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const createEthernetIP = gql`
  mutation CreateEthernetIP(
    $name: String!
    $description: String!
    $host: String!
    $slot: Int!
  ) {
    createEthernetIP(
      name: $name
      description: $description
      host: $host
      slot: $slot
    ) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const updateEthernetIP = gql`
  mutation UpdateEthernetIP(
    $id: ID!
    $name: String
    $description: String
    $host: String
    $slot: Int
  ) {
    updateEthernetIP(
      id: $id
      name: $name
      description: $description
      host: $host
      slot: $slot
    ) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const deleteEthernetIP = gql`
  mutation DeleteEthernetIP($id: ID!) {
    deleteEthernetIP(id: $id) {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

export default {
  login,
  changePassword,
  createScanClass,
  updateScanClass,
  deleteScanClass,
  createTag,
  updateTag,
  deleteTag,
  createModbus,
  updateModbus,
  deleteModbus,
  createEthernetIP,
  updateEthernetIP,
  deleteEthernetIP
}
