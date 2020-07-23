import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import discordClient from '~/discordOauth'
import axios from 'axios'

const Validate = () => {
  const location = useLocation()
  const history = useHistory()
  useEffect(() => {
    checkValidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkValidate = async () => {
    const params = queryString.parse(location.search)
    try {
      const res = await axios.post(
        'https://discord.com/api/oauth2/token',
        queryString.stringify({
          client_id: discordClient.clientId,
          client_secret: discordClient.clientSecret,
          redirect_uri: 'http://localhost:3000/validate',
          scope: 'identify',
          grant_type: 'authorization_code',
          code: params.code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      console.log('res :>> ', res)
      if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.access_token)
        localStorage.setItem('refreshToken', res.data.refresh_token)
        history.push('/')
      } else {
        history.push('/login')
      }
    } catch (err) {
      console.log('err :>> ', err)
      history.push('/login')
    }
  }

  return (
    <div>
      <h1>validating</h1>
    </div>
  )
}

export default Validate
