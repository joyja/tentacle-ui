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

const createMqtt = gql`
  mutation CreateMqtt(
    $name: String!
    $description: String!
    $host: String!
    $port: Int!
    $group: String!
    $node: String!
    $username: String!
    $password: String!
    $devices: [ID!]!
    $rate: Int!
    $encrypt: Boolean!
    $recordLimit: Int!
    $primaryHosts: [String!]
  ) {
    createMqtt(
      name: $name
      description: $description
      host: $host
      port: $port
      group: $group
      node: $node
      username: $username
      password: $password
      devices: $devices
      rate: $rate
      encrypt: $encrypt
      recordLimit: $recordLimit
      primaryHosts: $primaryHosts
    ) {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

const updateMqtt = gql`
  mutation UpdateMqtt(
    $id: ID!
    $name: String!
    $description: String!
    $host: String!
    $port: Int!
    $group: String!
    $node: String!
    $username: String!
    $password: String!
    $rate: Int!
    $encrypt: Boolean!
    $recordLimit: Int!
  ) {
    updateMqtt(
      id: $id
      name: $name
      description: $description
      host: $host
      port: $port
      group: $group
      node: $node
      username: $username
      password: $password
      rate: $rate
      encrypt: $encrypt
      recordLimit: $recordLimit
    ) {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

const deleteMqtt = gql`
  mutation DeleteMqtt($id: ID!) {
    deleteMqtt(id: $id) {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

const addMqttSource = gql`
  mutation AddMqttSource($id: ID!, $deviceId: ID!) {
    addMqttSource(id: $id, deviceId: $deviceId) {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

const deleteMqttSource = gql`
  mutation DeleteMqttSource($id: ID!, $deviceId: ID!) {
    deleteMqttSource(id: $id, deviceId: $deviceId) {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

const addMqttPrimaryHost = gql`
  mutation AddMqttPrimaryHost($id: ID!, $name: String!) {
    addMqttPrimaryHost(id: $id, name: $name) {
      ...MqttPrimaryHostBasic
    }
  }
  ${fragment.mqttPrimaryHost}
`

const deleteMqttPrimaryHost = gql`
  mutation deleteMqttPrimaryHost($id: ID!, $name: String!) {
    deleteMqttPrimaryHost(id: $id, name: $name) {
      ...MqttPrimaryHostBasic
    }
  }
  ${fragment.mqttPrimaryHost}
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
  deleteEthernetIP,
  createMqtt,
  updateMqtt,
  deleteMqtt,
  addMqttSource,
  deleteMqttSource,
  addMqttPrimaryHost,
  deleteMqttPrimaryHost
}
