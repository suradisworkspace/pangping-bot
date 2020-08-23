const { validationResult, body } = require('express-validator')
const ytdl = require('ytdl-core')

const { discordValidator } = require('./validator')
const discordService = require('../services/discord')
const checkAdmin = require('../utils/checkAdmin')

const settings = (app, client) => {
  app.get('/api/guild/:id', discordValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send('400 Bad Request')
    }
    try {
      const { params } = req
      const user = await discordService.getUser(req.headers)
      const guild = client.guilds.cache.get(params.id)
      if (!guild) {
        return res.status(400).send('Bad Request')
      }
      if (checkAdmin(guild, user.id)) {
        const guildInfo = {
          name: guild.name,
          id: guild.id,
          icon: guild.icon,
          settings: {
            commandPrefix: guild.commandPrefix,
          },
          customCommands: await guild.settings.get('customCommands', {}),
        }
        res.type('json')
        return res.json(guildInfo)
      }
      return res.status(401).send('Unauthorized')
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).send(error.response.statusText)
      }
      return res.status(500).send('Internal Server Error')
    }
  })
  app.post(
    '/api/editSettings',
    [...discordValidator, body('id').not().isEmpty(), body('commandPrefix').not().isEmpty()],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).send('Bad Request')
      }
      try {
        const { body, headers } = req
        const user = await discordService.getUser(headers)
        const guild = client.guilds.cache.get(body.id)
        if (!guild) {
          return res.status(400).send('Bad Request')
        }
        if (checkAdmin(guild, user.id)) {
          const { commandPrefix } = req.body
          if (commandPrefix) {
            guild.commandPrefix = commandPrefix
          }
          return res.status(200).json({
            commandPrefix,
          })
        }
        return res.status(401).send('Unauthorized')
      } catch (error) {}
    }
  )

  app.post(
    '/api/addCustomCommand',
    [...discordValidator, body('id').not().isEmpty(), body('command').not().isEmpty(), body('url').not().isEmpty()],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // IMPLEMENT HERE
        // handle error here

        return res.status(400).send('Bad Request')
      }
      const { body, headers } = req
      const user = await discordService.getUser(headers)
      const guild = client.guilds.cache.get(body.id)
      if (!guild || !ytdl.validateURL(body.url) || body.commad.indexOf(' ') === -1) {
        return res.status(400).send('Bad Request')
      }
      if (checkAdmin(guild, user.id)) {
        const customCommands = await guild.settings.get('customCommands', {})
        if (customCommands[body.command]) {
          return res.status(400).json({
            status: 'error',
            message: 'duplicated command',
          })
        }
        const newCustomCommands = {
          ...(await guild.settings.get('customCommands', {})),
          [body.command]: body.url,
        }
        await guild.settings.set('customCommands', newCustomCommands)

        return res.status(200).json(newCustomCommands)
      }
      return res.status(401).send('Unauthorized')
    }
  )
}

module.exports = settings
