const path = require('path')
const express = require('express')
const { CommandoClient } = require('discord.js-commando')
const Keyv = require('keyv')
const KeyvProvider = require('commando-provider-keyv')
require('dotenv').config()

const app = express()
app.use(express.static(path.join(__dirname, '/build')))

app.get('/api/getList', (req, res) => {
  var list = ['item1', 'item2', 'item3']
  res.json(list)
  console.log('Sent list of items')
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

const settings = { serialize: (data) => data, deserialize: (data) => data }

client.setProvider(new KeyvProvider(new Keyv(process.env.REACT_APP_DB_HOST, settings)))

client.login(process.env.REACT_APP_DISCORD_TOKEN)
