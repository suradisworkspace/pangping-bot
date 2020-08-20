const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const runMusic = require('../../worker/runMusic')
const { Command } = require('discord.js-commando')
const ytsr = require('ytsr')
const deleteMsg = require('../../utils/deleteMsg')
const { dropWhile, head } = require('lodash')
const HttpsProxyAgent = require('https-proxy-agent')
const proxy = process.env.QUOTAGUARD_URL
const agent = proxy ? HttpsProxyAgent(proxy) : null

module.exports = class play extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      memberName: 'play',
      aliases: ['p'],
      group: 'music',
      description: 'คำสั่งเล่นเพลง',
      details: 'play function.',
      examples: ['!play', '!p'],
      args: [
        {
          key: 'searchQuery',
          prompt: 'อยากเล่นเพลงอะไร?',
          type: 'string',
        },
      ],
    })
  }

  async playlistNormalize(searchQuery) {
    const indexRegex = /(&index=\d+)/g
    const foundedIndex = searchQuery.match(indexRegex)
    let index = 0
    if (foundedIndex) {
      index = parseInt(foundedIndex[0].replace('&index=', '')) - 1
    }
    try {
      const res = await ytpl(searchQuery)
      const song = res.items.slice(index).map((item) => ({
        title: item.title,
        url: item.url_simple,
        thumbnail: item.thumbnail,
      }))
      return { playlistName: res.title, song }
    } catch (e) {
      if (ytdl.validateURL(searchQuery)) {
        const query = agent
          ? await ytdl.getInfo(searchQuery, {
              requestOptions: { agent },
            })
          : await ytdl.getInfo(searchQuery)
        const song = [
          {
            title: query.title,
            url: query.video_url,
            thumbnail: query.player_response.videoDetails.thumbnail.thumbnails[0].url,
          },
        ]
        return { playlistName: '', song }
      }
    }
  }

  async run(msg, { searchQuery }) {
    const { queue } = this.client.options
    const serverQ = queue.get(msg.guild.id)
    const voiceChannel = msg.member.voice.channel

    // check case
    if (!voiceChannel) return msg.channel.send('เข้าห้องก่อนคับ')
    const permissions = voiceChannel.permissionsFor(msg.client.user)
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return msg.channel.send('คุณไม่ให้สิทธิผมอ่ะ')
    }

    let song
    let playlistName = ''
    if (ytpl.validateURL(searchQuery)) {
      const playlist = await this.playlistNormalize(searchQuery)
      song = playlist.song
      playlistName = playlist.name
    } else {
      let query
      try {
        if (ytdl.validateURL(searchQuery)) {
          query = agent
            ? await ytdl.getInfo(searchQuery, {
                requestOptions: { agent },
              })
            : await ytdl.getInfo(searchQuery)
          song = [
            {
              title: query.title,
              url: query.video_url,
              thumbnail: query.player_response.videoDetails.thumbnail.thumbnails[0].url,
            },
          ]
        } else {
          const query = await ytsr(searchQuery, { limit: 5 })
          const item = head(
            dropWhile(query.items, (searchItem) => searchItem.type !== 'video' && searchItem.type !== 'playlist')
          )
          if (!item) return msg.channel.send('หาเพลงไม่เจอคับ')
          if (item.type === 'video') {
            song = [
              {
                title: item.title,
                url: item.link,
                thumbnail: item.thumbnail,
              },
            ]
          } else if (item.type === 'playlist') {
            const playlist = await this.playlistNormalize(item.link)
            song = playlist.song
            playlistName = playlist.name
          }
        }
      } catch (e) {
        console.log('e', e)
        return msg.channel.send('เออเร่อ')
      }
    }

    if (!serverQ) {
      // Creating the contract for our queue
      const queueContruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        autoMode: false,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      }
      // Setting the queue using our contract
      queue.set(msg.guild.id, queueContruct)
      // Pushing the song to our songs array
      queueContruct.songs.push(...song)
      try {
        // Here we try to join the voicechat and save our connection into our object.
        let connection = await voiceChannel.join()
        queueContruct.connection = connection
        // Calling the play function to start a song
        runMusic(queue, msg.guild, queueContruct.songs[0])
        msg.channel.send(`เพิ่มเพลง ${'`'}${song[0].title}${'`'} ไปในคิวแล้วคับ`)
        return deleteMsg(msg)
      } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err)
        queue.delete(msg.guild.id)
        return msg.channel.send('เออเร่อ')
      }
    } else {
      serverQ.songs.push(...song)
      if (!playlistName) {
        msg.channel.send(`เพิ่มเพลง ${'`'}${song[0].title}${'`'} ไปในคิวแล้วคับ`)
      } else {
        msg.channel.send(`เพิ่ม playlist ${'`'}${playlistName}${'`'} ไปในคิวแล้วคับ`)
      }
      return deleteMsg(msg)
    }
  }
}
