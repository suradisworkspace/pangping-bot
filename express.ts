const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const Keyv = require('keyv')
const KeyvProvider = require('commando-provider-keyv')
const { body, validationResult } = require('express-validator')
require('dotenv').config()

const settings = { serialize: (data) => data, deserialize: (data) => data, namespace: 'users' }
const app = express()
app.use(express.static(path.join(__dirname, '/build')))

app.get('/api/getList', (req, res) => {
  var list = ['item1', 'item2', 'item3']
  res.json(list)
  console.log('Sent list of items')
})

app.get('/api/test', async (req, res) => {
  // console.log('req', req)
  // console.log('res', res)
  const users = new Keyv(process.env.REACT_APP_DB_HOST, settings)
  const db = await users.get('317652808641806350')
  console.log('db', db)
  var list = ['item1', 'item2', 'item3']
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

client.setProvider(new KeyvProvider(new Keyv(process.env.REACT_APP_DB_HOST, settings)))

client.login(process.env.REACT_APP_DISCORD_TOKEN)
