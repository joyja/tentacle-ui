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
    deadband
    units
    scanClass {
      ...ScanClassBasic
    }
    createdBy {
      ...UserBasic
    }
    source {
      __typename
      ... on ModbusSource {
        register
        registerType
        modbus {
          status
          device {
            id
            name
            description
          }
        }
      }
      ... on EthernetIPSource {
        tagname
        ethernetip {
          status
          device {
            id
            name
            description
          }
        }
      }
      ... on OpcuaSource {
        nodeId
        opcua {
          status
          device {
            id
            name
            description
          }
        }
      }
    }
  }
  ${user}
  ${scanClass}
`
const opcuaNode = gql`
  fragment OpcuaNodeBasic on OpcuaNode {
    id
    name
    datatype
    value
    children {
      id
      name
      datatype
      value
      children {
        id
        name
        datatype
        value
        children {
          id
          name
          datatype
          value
          children {
            id
            name
            datatype
            value
            children {
              id
              name
              datatype
              value
              children {
                id
                name
                datatype
                value
                children {
                  id
                  name
                  datatype
                  value
                  children {
                    id
                    name
                    datatype
                    value
                    children {
                      id
                      name
                      datatype
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const opcuaSource = gql`
  fragment OpcuaSourceBasic on OpcuaSource {
    tag {
      ...TagBasic
    }
    nodeId
  }
  ${tag}
`

const opcua = gql`
  fragment OpcuaBasic on Opcua {
    id
    host
    port
    retryRate
    status
    nodes {
      ...OpcuaNodeBasic
    }
    flatNodes {
      id
      name
    }
    sources {
      ...OpcuaSourceBasic
    }
  }
  ${opcuaNode}
  ${opcuaSource}
`

const modbusSource = gql`
  fragment ModbusSourceBasic on ModbusSource {
    tag {
      ...TagBasic
    }
    register
    registerType
  }
  ${tag}
`

const modbus = gql`
  fragment ModbusBasic on Modbus {
    id
    host
    port
    reverseBits
    reverseWords
    timeout
    retryRate
    sources {
      ...ModbusSourceBasic
    }
    status
    zeroBased
  }
  ${modbusSource}
`

const ethernetipSource = gql`
  fragment EthernetIPSourceBasic on EthernetIPSource {
    tag {
      ...TagBasic
    }
    tagname
  }
  ${tag}
`

const ethernetip = gql`
  fragment EthernetIPBasic on EthernetIP {
    id
    host
    slot
    status
    sources {
      ...EthernetIPSourceBasic
    }
  }
  ${tag}
  ${ethernetipSource}
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
        ...EthernetIPBasic
      }
      ... on Opcua {
        ...OpcuaBasic
      }
    }
  }
  ${user}
  ${tag}
  ${modbus}
  ${ethernetip}
  ${opcua}
`

const mqttSource = gql`
  fragment MqttSourceBasic on MqttSource {
    id
    device {
      ...DeviceBasic
    }
  }
  ${device}
`

const mqttPrimaryHost = gql`
  fragment MqttPrimaryHostBasic on MqttPrimaryHost {
    id
    name
    status
    recordCount
  }
`

const mqtt = gql`
  fragment MqttBasic on Mqtt {
    id
    host
    port
    group
    node
    username
    password
    sources {
      ...MqttSourceBasic
    }
    rate
    encrypt
    recordLimit
    primaryHosts {
      ...MqttPrimaryHostBasic
    }
  }
  ${mqttSource}
  ${mqttPrimaryHost}
`

const service = gql`
  fragment ServiceBasic on Service {
    id
    name
    description
    config {
      ...MqttBasic
    }
  }
  ${mqtt}
`

export default {
  user,
  scanClass,
  tag,
  opcuaSource,
  opcua,
  modbusSource,
  modbus,
  ethernetipSource,
  ethernetip,
  device,
  service,
  mqttPrimaryHost,
}
