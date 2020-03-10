import gql from 'graphql-tag'

const user = gql`
  fragment UserBasic on User {
    id
    username
  }
`

const scanClass = gql`
  fragment ScanClassBasic on ScanClass {
    id
    name
    description
    rate
  }
`

const tag = gql`
  fragment TagBasic on Tag {
    id
    name
    description
    value
    datatype
    max
    min
    units
    scanClass {
      ...ScanClassBasic
    }
    createdBy {
      ...UserBasic
    }
  }
  ${user}
  ${scanClass}
`

const modbusSource = gql`
  fragment modbusSourceBasic on modbusSource {
    tag {
      ...TagBasic
    }
    register
    registerType
  }
`

const modbus = gql`
  fragment ModbusBasic on Modbus {
    id
    host
    port
    reverseBits
    reverseWords
    timeout
    sources {
      ...modbusSourceBasic
    }
    status
    zeroBased
  }
  ${tag}
  ${modbusSource}
`

const device = gql`
  fragment DeviceBasic on Device {
    id
    name
    description
    createdBy {
      ...UserBasic
    }
    createdOn
    config {
      __typename
      ... on Modbus {
        ...ModbusBasic
      }
      ... on EthernetIP {
        id
      }
    }
  }
  ${user}
  ${tag}
  ${modbus}
`

export default {
  user,
  scanClass,
  tag,
  modbusSource,
  modbus,
  device
}
