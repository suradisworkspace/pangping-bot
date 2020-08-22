const { header } = require('express-validator')

const discordValidator = [header('authorization').not().isEmpty()]

module.exports = {
  discordValidator,
}
