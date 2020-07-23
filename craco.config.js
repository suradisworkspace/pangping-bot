const path = require('path')

module.exports = function (api) {
  // api.cache(true)
  return {
    webpack: {
      alias: {
        '~': path.resolve(__dirname, 'src/'),
      },
    },
    jest: {
      configure: {
        moduleNameMapper: {
          '^~(.*)$': '<rootDir>/src$1',
        },
      },
    },
  }
}
