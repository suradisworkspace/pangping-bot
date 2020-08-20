const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const KeyvProvider = require('commando-provider-keyv')
const { validationResult, header, body } = require('express-validator')
const Keyv = require('keyv')
const discordService = require('./services/discord')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const checkAdmin = require('./utils/checkAdmin')
const settings = { serialize: (data) => data, deserialize: (data) => data, namespace: 'users', collection: 'settings' }
require('dotenv').config()
// DISCORD
const queue = new Map()

const client = new CommandoClient({
  commandPrefix: '!',
  unknownCommandResponse: true,
  owner: '265037333915631616',
  disableEveryone: true,
  queue,
})

const discordValidator = [header('authorization').not().isEmpty()]

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({ help: false, unknownCommand: false })
  .registerGroups([
    ['basic', 'Basic'],
    ['music', 'Music Controller'],
    ['meme', 'Meme Collection'],
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  const app = express()
  const cookiesHeaders = (req, res, next) => {
    if (process.env.EXPRESS_MODE === 'dev') {
      req.headers = {
        ...req.headers,
        authorization: `Bearer ${req.cookies.access_token}`,
      }
    }
    next()
  }

  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookiesHeaders)

  app.use(express.static(path.join(__dirname, '/build')))

  app.get('/api/getList', (req, res) => {
    var list = ['item1', 'item2', 'item3']
    res.json(list)
    console.log('Sent list of items')
  })

  app.get('/api/test', (req, res) => {
    // const guild = client.guilds.cache.get('317652808641806350')
    // const { settings } = guild
    console.log('client.provider :>> ', client.provider)
    client.provider.set('317652808641806350', 'someThing', 'test')
    var list = ['item1', 'item2', 'item3']
    res.json(list)
  })

  app.get('/api/userInfo', discordValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send('400 Bad Request')
    }
    try {
      const user = await discordService.getUser(req.headers)
      console.log('user :>> ', user)
      // const guilds = await discordService.getGuilds(req.headers)
      const filteredGuilds = client.guilds.cache.filter((guild) => checkAdmin(guild, user.id))
      res.type('json')
      return res.json({
        user,
        guilds: filteredGuilds,
      })
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).send(error.response.statusText)
      }
      return res.status(500).send('Internal Server Error')
    }
  })

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
          const { commandPrefix, ...restBody } = req.body
          if (commandPrefix) {
            guild.commandPrefix = commandPrefix
          }
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
      if (!guild) {
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

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'))
  })

  const port = process.env.PORT || 5000
  app.listen(port)
})

client.setProvider(new KeyvProvider(new Keyv(process.env.REACT_APP_DB_HOST, settings)))

client.login(process.env.REACT_APP_DISCORD_TOKEN)
