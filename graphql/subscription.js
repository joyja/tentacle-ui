import gql from 'graphql-tag'
import fragment from './fragment'

const tagUpdate = gql`
  subscription TagUpdate {
    tagUpdate {
      ...TagBasic
    }
  }
  ${fragment.tag}
`

const deviceUpdate = gql`
  subscription DeviceUpdate {
    deviceUpdate {
      ...DeviceBasic
    }
  }
  ${fragment.device}
`

const serviceUpdate = gql`
  subscription ServiceUpdate {
    serviceUpdate {
      ...ServiceBasic
    }
  }
  ${fragment.service}
`

export default {
  tagUpdate,
  deviceUpdate,
  serviceUpdate,
}
