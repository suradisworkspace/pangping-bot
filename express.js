const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const KeyvProvider = require('commando-provider-keyv')
const { validationResult, header } = require('express-validator')
const Keyv = require('keyv')
const discordService = require('./services/discord')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const checkAdmin = require('./utils/checkAdmin')
const settingsAPI = require('./api/settings')
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

  settingsAPI(app, client)

  app.get('/api/userInfo', discordValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send('400 Bad Request')
    }
    try {
      const user = await discordService.getUser(req.headers)
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

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'))
  })

  const port = process.env.PORT || 5000
  app.listen(port)
})

client.setProvider(new KeyvProvider(new Keyv(process.env.REACT_APP_DB_HOST, settings)))

client.login(process.env.REACT_APP_DISCORD_TOKEN)
