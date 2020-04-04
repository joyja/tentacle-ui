export const mockScanClasses = [
  {
    id: '1',
    name: 'default',
    description: 'The default scan class',
    rate: 1000
  },
  {
    id: '2',
    name: 'slow',
    description: 'A slower scan class',
    rate: 2000
  },
  {
    id: '3',
    name: 'fast',
    description: 'A faster scan class',
    rate: 500
  }
]
export const mockTags = [
  {
    id: '1',
    name: 'testTag',
    description: 'Test Tag',
    value: '0',
    datatype: 'FLOAT',
    scanClass: mockScanClasses[0],
    createdBy: {
      id: '1',
      username: 'admin'
    },
    createdOn: new Date().toISOString()
  },
  {
    id: '2',
    name: 'testTag',
    description: 'Test Tag',
    value: '0',
    datatype: 'BOOLEAN',
    scanClass: mockScanClasses[0],
    createdBy: {
      id: '1',
      username: 'admin'
    },
    createdOn: new Date().toISOString(),
    max: 300,
    min: 100
  },
  {
    id: '3',
    name: 'testTag3',
    description: 'Test Tag3',
    value: '0',
    datatype: 'FLOAT',
    scanClass: mockScanClasses[0],
    createdBy: {
      id: '1',
      username: 'admin'
    },
    createdOn: new Date().toISOString()
  },
  {
    id: '4',
    name: 'testTag4',
    description: 'Test Tag 4',
    value: '0',
    datatype: 'FLOAT',
    scanClass: mockScanClasses[0],
    createdBy: {
      id: '1',
      username: 'admin'
    },
    createdOn: new Date().toISOString()
  }
]

export const mockDevices = [
  {
    id: '1',
    name: 'aDevice',
    description: 'A really great device',
    createdBy: { id: '1', username: 'admin', __typename: 'User' },
    createdOn: '2020-03-12T13:53:14.000Z',
    config: {
      __typename: 'Modbus',
      device: {
        id: '1',
        name: 'aDevice',
        description: 'A really great device'
      },
      id: '1',
      host: 'localhost',
      port: '502',
      reverseBits: true,
      reverseWords: true,
      timeout: 5000,
      retryRate: 5000,
      sources: [
        {
          tag: mockTags[0],
          register: 4864,
          registerType: 'INPUT_REGISTER',
          __typename: 'ModbusSource'
        }
      ],
      status: 'connected',
      zeroBased: true
    },
    __typename: 'Device'
  },
  {
    id: '2',
    name: 'aDevice',
    description: 'A really great device',
    createdBy: { id: '1', username: 'admin', __typename: 'User' },
    createdOn: '2020-03-12T13:53:14.000Z',
    config: {
      __typename: 'EthernetIP',
      id: '1',
      host: 'localhost',
      slot: '2',
      status: 'connecting'
    },
    __typename: 'Device'
  },
  {
    id: '3',
    name: 'anotherDevice',
    description: 'A really terrible device',
    createdBy: { id: '1', username: 'admin', __typename: 'User' },
    createdOn: '2020-03-12T13:53:14.000Z',
    config: {
      __typename: 'EthernetIP',
      id: '1',
      host: 'localhost',
      slot: '2',
      status: 'Error: something really bad happened'
    },
    __typename: 'Device'
  },
  {
    id: '4',
    name: 'aDevice',
    description: 'A really great device',
    createdBy: { id: '1', username: 'admin', __typename: 'User' },
    createdOn: '2020-03-12T13:53:14.000Z',
    config: {
      __typename: 'Modbus',
      device: {
        id: '1',
        name: 'aDevice',
        description: 'A really great device'
      },
      id: '1',
      host: 'localhost',
      port: '502',
      reverseBits: true,
      reverseWords: true,
      timeout: 5000,
      retryRate: 5000,
      sources: [
        {
          tag: mockTags[2],
          register: 4865,
          registerType: 'INPUT_REGISTER',
          __typename: 'ModbusSource'
        }
      ],
      status: 'connecting',
      zeroBased: true
    },
    __typename: 'Device'
  },
  {
    id: '5',
    name: 'aDevice',
    description: 'A really great device',
    createdBy: { id: '1', username: 'admin', __typename: 'User' },
    createdOn: '2020-03-12T13:53:14.000Z',
    config: {
      __typename: 'Modbus',
      device: {
        id: '1',
        name: 'aDevice',
        description: 'A really great device'
      },
      id: '1',
      host: 'localhost',
      port: '502',
      reverseBits: true,
      reverseWords: true,
      timeout: 5000,
      retryRate: 5000,
      sources: [
        {
          tag: mockTags[3],
          register: 4866,
          registerType: 'INPUT_REGISTER',
          __typename: 'ModbusSource'
        }
      ],
      status: 'Error: something really bad happened',
      zeroBased: true
    },
    __typename: 'Device'
  }
]

mockTags[0].source = {
  modbus: mockDevices[0].config,
  register: 4864,
  registerType: 'INPUT_REGISTER',
  __typename: 'ModbusSource'
}
mockTags[2].source = {
  modbus: mockDevices[3].config,
  register: 4865,
  registerType: 'INPUT_REGISTER',
  __typename: 'ModbusSource'
}
mockTags[3].source = {
  modbus: mockDevices[4].config,
  register: 4866,
  registerType: 'INPUT_REGISTER',
  __typename: 'ModbusSource'
}

export const mockServices = [
  {
    id: '1',
    name: 'aService',
    description: 'A really great service',
    config: {
      id: '1',
      host: 'localhost',
      port: '1883',
      group: 'Group 1',
      node: 'Tentacle 1',
      username: 'aUsername',
      password: 'aPassword',
      sources: [
        {
          id: '1',
          device: mockDevices[0],
          __typename: 'MqttSource'
        }
      ],
      rate: 5000,
      encrypt: false,
      recordLimit: 200,
      primaryHosts: [
        {
          id: '1',
          name: 'ignition1',
          status: 'OFFLINE',
          recordCount: 64420,
          __typename: 'MqttPrimaryHost'
        }
      ],
      __typename: 'Mqtt'
    },
    __typename: 'Service'
  },
  {
    id: '2',
    name: 'anotherService',
    description: 'Another really great service',
    config: {
      id: '1',
      host: 'localhost',
      port: '1883',
      group: 'Group 1',
      node: 'Tentacle 2',
      username: 'aUsername',
      password: 'aPassword',
      sources: [
        {
          id: '1',
          device: mockDevices[1],
          __typename: 'MqttSource'
        }
      ],
      rate: 5000,
      encrypt: false,
      recordLimit: 200,
      primaryHosts: [
        {
          id: '1',
          name: 'ignition1',
          status: 'ONLINE',
          recordCount: 120,
          __typename: 'MqttPrimaryHost'
        }
      ],
      __typename: 'Mqtt'
    },
    __typename: 'Service'
  },
  {
    id: '3',
    name: 'anotherService',
    description: 'A terrible service',
    config: {
      id: '1',
      host: 'localhost',
      port: '1883',
      group: 'Group 1',
      node: 'Tentacle 2',
      username: 'aUsername',
      password: 'aPassword',
      sources: [
        {
          id: '1',
          device: mockDevices[2],
          __typename: 'MqttSource'
        }
      ],
      rate: 5000,
      encrypt: false,
      recordLimit: 200,
      primaryHosts: [
        {
          id: '1',
          name: 'ignition1',
          status: 'Error: Something really bad happened.',
          recordCount: 120,
          __typename: 'MqttPrimaryHost'
        }
      ],
      __typename: 'Mqtt'
    },
    __typename: 'Service'
  }
]

export default {
  mockScanClasses,
  mockTags,
  mockDevices,
  mockServices
}
