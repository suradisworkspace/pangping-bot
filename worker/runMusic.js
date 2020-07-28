const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const { youtubeKey } = require('../configs.json')
const secondToTime = require('../utils/secondToTime')
const axios = require('axios')

const run = (queue, guild, song) => {
  const serverQ = queue.get(guild.id)
  if (!song) {
    serverQ.voiceChannel.leave()
    serverQ.textChannel.send('เล่นเพลงหมดแล้วคับ')
    queue.delete(guild.id)
    return
  }
  try {
    const dispatcher = serverQ.connection
      .play(
        ytdl(song.url, {
          quality: 'highestaudio',
          highWaterMark: 1024 * 1024 * 10,
        })
      )
      .on('start', () => {
        const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setTitle(`กำลังเล่น: ${song.title}`)
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
        serverQ.textChannel.send(embed)
      })
      .on('finish', async () => {
        const tempSongs = { ...serverQ.songs[0] }
        serverQ.songs.shift()
        if (!!tempSongs && !serverQ.songs.length && serverQ.autoMode) {
          // const res = await axios.get(
          //   "https://www.googleapis.com/youtube/v3/search",
          //   {
          //     params: {
          //       part: "snippet",
          //       relatedToVideoId: ytdl.getURLVideoID(tempSongs.url),
          //       type: "video",
          //       maxResults: 2,
          //       key: youtubeKey,
          //       pageToken: tempSongs.nextPageToken || "",
          //     },
          //   }
          // );

          // const pickItem = res.data.items[0];
          // console.log("pickItem", pickItem);
          // const query = await ytdl.getInfo(pickItem.id.videoId);

          // //find query list here
          // const song = {
          //   nextPageToken: res.data.nextPageToken,
          //   title: query.title,
          //   url: query.video_url,
          //   thumbnail:
          //     query.player_response.videoDetails.thumbnail.thumbnails[0].url,
          // };
          const res = await ytdl.getInfo(tempSongs.url)
          if (res.related_videos.length) {
            const query = await ytdl.getInfo(res.related_videos[0].id)
            song = {
              title: query.title,
              url: query.video_url,
              thumbnail: query.player_response.videoDetails.thumbnail.thumbnails[0].url,
            }
            // add to queue
            serverQ.songs.push(song)
          }
        }
        run(queue, guild, serverQ.songs[0])
      })
      .on('error', (error) => {
        console.log('error', error)
        serverQ.voiceChannel.leave()
        serverQ.textChannel.send('เออเร่อในขณะกำลังเล่นเพลงคับ')
        queue.delete(guild.id)
        return
      })
    dispatcher.setVolumeLogarithmic(serverQ.volume / 5)
    return
  } catch (error) {
    console.log('error', error)
    serverQ.voiceChannel.leave()
    serverQ.textChannel.send('เออเร่อในขณะกำลังเล่นเพลงคับ')
    queue.delete(guild.id)
  }
}
module.exports = run
