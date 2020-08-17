const axios = require('axios')

const getUser = async (headers) => {
  return await axios
    .get('https://discord.com/api/users/@me', {
      headers,
    })
    .then((res) => res.data)
}

const getGuilds = async (headers) => {
  console.log('headers :>> ', headers)
  return await axios
    .get('https://discord.com/api/users/@me/guilds', {
      headers,
    })
    .then((res) => res.data)
}

module.exports = {
  getUser,
  getGuilds,
}
