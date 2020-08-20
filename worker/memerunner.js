const ytdl = require('ytdl-core')
const runMusic = require('./runMusic')
const deleteMsg = require('../utils/deleteMsg')

const youtubeHeader = {
  requestOptions: {
    headers: {
      Cookie: process.env.YOUTUBE_COOKIE,
    },
  },
}

module.exports = async (msg, queue, serverQ, url) => {
  const voiceChannel = msg.member.voice.channel

  // check case
  if (!voiceChannel) return msg.channel.send('เข้าห้องก่อนคับ')
  if (!msg.guild.me.hasPermission('CONNECT') || !msg.guild.me.hasPermission('SPEAK')) {
    return msg.channel.send('คุณไม่ให้สิทธิผมอ่ะ')
  }

  let song
  try {
    const query = await ytdl.getInfo(url, youtubeHeader)
    song = {
      title: query.title,
      url: query.video_url,
      thumbnail: query.player_response.videoDetails.thumbnail.thumbnails[0].url,
    }
  } catch (err) {
    console.log('meme error :>>', err)
    return msg.channel.send('เออเร่อ')
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
    queueContruct.songs.push(song)
    try {
      // Here we try to join the voicechat and save our connection into our object.
      let connection = await voiceChannel.join()
      queueContruct.connection = connection
      // Calling the play function to start a song
      runMusic(queue, msg.guild, queueContruct.songs[0])
    } catch (err) {
      // Printing the error message if the bot fails to join the voicechat
      console.log(err)
      queue.delete(msg.guild.id)
      return msg.channel.send('เออเร่อ')
    }
  } else {
    serverQ.songs.splice(0, 0, song, song)
    serverQ.connection.dispatcher.end()
    return deleteMsg(msg)
  }
}
