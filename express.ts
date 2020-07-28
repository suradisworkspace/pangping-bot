const express = require('express')
const path = require('path')
const { token } = require('./configs.json')
const { CommandoClient } = require('discord.js-commando')
const Keyv = require('keyv')
const KeyvProvider = require('commando-provider-keyv')

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

// discord

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

client.setProvider(
  new KeyvProvider(new Keyv('mongodb://pangping:q1w2e3r4@ds147461.mlab.com:47461/heroku_cvn3w73l', settings))
)

client.login(token)
