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

export default {
  user,
  tags,
  scanClasses
}
