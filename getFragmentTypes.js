const fs = require('fs')
const fetch = require('node-fetch')

const url = process.env.TENTACLE_URL || 'http://localhost:4000'

const getSchema = function() {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `
    })
  })
    .then((result) => result.json())
    .then((result) => {
      // here we're filtering out any type information unrelated to unions or interfaces
      const filteredData = result.data.__schema.types.filter(
        (type) => type.possibleTypes !== null
      )
      result.data.__schema.types = filteredData
      fs.writeFileSync(
        './fragmentTypes.json',
        JSON.stringify(result.data),
        (err) => {
          if (err) {
            throw new Error('Error writing fragmentTypes file', err)
          }
        }
      )
    })
}

module.exports = getSchema
