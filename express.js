const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const KeyvProvider = require('commando-provider-keyv')
const { validationResult, header } = require('express-validator')
const { Permissions } = require('discord.js')
const axios = require('axios')
const Keyv = require('keyv')
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
  app.use(express.static(path.join(__dirname, '/build')))

  app.get('/api/getList', (req, res) => {
    var list = ['item1', 'item2', 'item3']
    res.json(list)
    console.log('Sent list of items')
  })

  app.get('/api/test', (req, res) => {
    var list = ['item1', 'item2', 'item3']
    const guild = client.guilds.cache.get('317652808641806350')
    const { settings } = guild
    if (settings._commandPrefix !== '!') {
      guild.commandPrefix = '!'
    }
    res.json(list)
  })

  app.get('/api/userInfo', discordValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const headers = {
        authorization: req.headers.authorization,
      }

      const user = await axios
        .get('https://discord.com/api/users/@me', {
          headers,
        })
        .then((res) => res.data)
      const guilds = await axios
        .get('https://discord.com/api/users/@me/guilds', {
          headers,
        })
        .then((res) => res.data)
      const filteredGuilds = guilds.filter((guild) => {
        if (guild.owner) {
          return true
        }
        const permissions = new Permissions(guild.permissions)
        if (permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
      console.log('error :>> ', error)
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

  console.log('App is listening on port ' + port)
})

client.setProvider(new KeyvProvider(new Keyv(process.env.REACT_APP_DB_HOST, settings)))

client.login(process.env.REACT_APP_DISCORD_TOKEN)
