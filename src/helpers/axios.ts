import axios, { AxiosRequestConfig } from 'axios'
import { Cookies } from 'react-cookie'

const instance = axios.create()

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    return config
  },
  (error) => Promise.reject(error)
)
export default instance
