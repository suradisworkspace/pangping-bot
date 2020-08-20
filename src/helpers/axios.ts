import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { Cookies } from 'react-cookie'

const instance = axios.create()

export type APIError = AxiosError<{
  errors: {
    message: string
    state: {
      [key: string]: string
    }
  }[]
}>

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const cookies = new Cookies()
    const accessToken = cookies.get('access_token')
    // const uid = cookies.get('uid')
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    // config.data = {
    //   uid,
    // }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: APIError) => {
    if (error.response) {
      if (error.response.status === 401) {
        try {
          // IMPLEMENT HERE
          // DO REFRESH TOKEN
          return instance(error.config)
        } catch (error) {
          // eslint-disable-next-line no-catch-shadow
          // IMPLEMENT HERE
          // LOGOUT
          return
        }
      }
    } else {
      // cannot connect internet
    }
    throw error
  }
)
export default instance
