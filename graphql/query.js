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

const services = gql`
  query Services {
    services {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

export default {
  user,
  tags,
  scanClasses,
  devices,
  services,
}
