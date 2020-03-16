import gql from 'graphql-tag'
import fragment from './fragment'

const user = gql`
  query User {
    user {
      id
      username
    }
  }
`

const tags = gql`
  query Tags {
    tags {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

const scanClasses = gql`
  query ScanClasses {
    scanClasses {
      ...ScanClassBasic
    }
  }
  ${fragment.scanClass}
`

const devices = gql`
  query Devices {
    devices {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`
export default {
  user,
  tags,
  scanClasses,
  devices
}
