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

export default {
  mockScanClasses,
  mockTags
}
