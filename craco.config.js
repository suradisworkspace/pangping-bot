const path = require('path')
const CracoAntDesignPlugin = require('craco-antd')

module.exports = function (api) {
  // api.cache(true)
  return {
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          customizeTheme: {
            // '@primary-color': '#1DA57A',
            // '@link-color': '#1DA57A',
          },
        },
      },
    ],
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
