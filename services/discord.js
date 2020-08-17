const axios = require('axios')

const getUser = async (headers) => {
  try {
    return await axios
      .get('https://discord.com/api/users/@me', {
        headers: {
          authorization: headers.authorization,
        },
      })
      .then((res) => res.data)
  } catch (error) {
    throw error
  }
}

const getGuilds = async (headers) => {
  try {
    return await axios
      .get('https://discord.com/api/users/@me/guilds', {
        headers: {
          authorization: headers.authorization,
        },
      })
      .then((res) => res.data)
  } catch (error) {
    throw error
  }
}

module.exports = {
  getUser,
  getGuilds,
}
