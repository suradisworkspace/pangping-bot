const connect = require('keyv')
const settings = { serialize: (data) => data, deserialize: (data) => data, namespace: 'users', collection: 'settings' }

const database = new connect(process.env.REACT_APP_DB_HOST, settings)

module.exports = database
