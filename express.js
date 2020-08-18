const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const KeyvProvider = require('commando-provider-keyv')
const { validationResult, header } = require('express-validator')
const { Permissions } = require('discord.js')
const Keyv = require('keyv')
const discordService = require('./services/discord')
const cookieParser = require('cookie-parser')
const settings = { serialize: (data) => data, deserialize: (data) => data, namespace: 'users', collection: 'settings' }
require('dotenv').config()
// DISCORD
const queue = new Map()

const client = new CommandoClient({
  commandPrefix: '!',
  unknownCommandResponse: false,
  owner: '265037333915631616',
  disableEveryone: true,
  queue,
})

const discordValidator = [header('authorization').not().isEmpty()]

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({ help: false })
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
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
    next()
  }

  app.use([cookieParser(), cookiesHeaders])

  app.use(express.static(path.join(__dirname, '/build')))

  app.get('/api/getList', (req, res) => {
    var list = ['item1', 'item2', 'item3']
    res.json(list)
    console.log('Sent list of items')
  })

  app.get('/api/test', (req, res) => {
    const filterdGuild = client.guilds.cache.filter((guild) => {
      const member = guild.member('265037333915631616')
      if (!member) {
        return false
      }
      if (member.user.id === member.ownerID || member.hasPermission('ADMINISTRATOR')) {
        return true
      }
      return false
    })

    console.log('filterdGuild :>> ', filterdGuild)
    // const guild = client.guilds.cache.get('317652808641806350')
    // const { settings } = guild
    // if (settings._commandPrefix !== '!') {
    //   guild.commandPrefix = '!'
    // }
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
      // const guilds = await discordService.getGuilds(req.headers)
      const filteredGuilds = client.guilds.cache.filter((guild) => {
        const member = guild.member(user.id)
        if (!member) {
          return false
        }
        if (member.user.id === member.ownerID || member.hasPermission('ADMINISTRATOR')) {
          return true
        }
        return false
      })
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
      if (!!guild && guild.members.cache.get(user.id)) {
        const guildInfo = {
          name: guild.name,
          id: guild.id,
          icon: guild.icon,
          _commandPrefix: guild._commandPrefix,
        }
        res.type('json')
        return res.json(guildInfo)
      }
      return res.status(400).send('Bad Request')
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
