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
    datatype: 'FLOAT',
    scanClass: mockScanClasses[0],
    createdBy: {
      id: '1',
      username: 'admin'
    },
    createdOn: new Date().toISOString(),
    max: 300,
    min: 100
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
      status: 'connected'
    },
    __typename: 'Device'
  }
]

export default {
  mockScanClasses,
  mockTags,
  mockDevices
}
