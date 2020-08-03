const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const KeyvProvider = require('commando-provider-keyv')
const { body, validationResult } = require('express-validator')
require('dotenv').config()
const db = require('./src/helpers/db.ts')

// DISCORD
const queue = new Map()

const client = new CommandoClient({
  commandPrefix: '!',
  unknownCommandResponse: false,
  owner: '265037333915631616',
  disableEveryone: true,
  queue,
})

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
})

client.setProvider(new KeyvProvider(db))

client.login(process.env.REACT_APP_DISCORD_TOKEN)

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

app.get('/api/getServer', [body('token').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req)
  console.log('errors', errors)
  res.type('json')
  var list = ['item1', 'item2', 'item3']
  res.json(list)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log('App is listening on port ' + port)

// api with discord
