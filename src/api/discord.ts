import axios from '~/helpers/axiosDiscord'
export default {
  user: {
    info: () => {
      return axios.get('/users/@me').then((res) => res.data)
    },
  },
}
