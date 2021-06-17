const merge = require('lodash/merge')

module.exports = merge({}, require('@zstark/eslint-plugin-zstark'), {
  globals: {
    uni: true,
    plus: true,
    TRACK: true,
  },
  rules: {},
})
