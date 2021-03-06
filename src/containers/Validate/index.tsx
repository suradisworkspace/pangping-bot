import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { Spin } from 'antd'
import { isEmpty } from 'lodash'
import queryString from 'query-string'
import styled from 'styled-components'
import discordClient from '~/discordOauth'
import axios from 'axios'

const Validate = () => {
  const location = useLocation()
  const history = useHistory()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies()
  useEffect(() => {
    checkValidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkValidate = async () => {
    const params = queryString.parse(location.search)
    if (!!cookies.access_token || isEmpty(params)) {
      history.push('/')
    }
    try {
      const { protocol, hostname, port } = window.location
      const isDevMode = process.env.REACT_APP_MODE === 'dev'
      const res = await axios.post(
        'https://discord.com/api/oauth2/token',
        queryString.stringify({
          client_id: discordClient.clientId,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          redirect_uri: `${protocol}//${hostname}${isDevMode ? `:${port}` : ''}/validate`,
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
      if (res.status === 200) {
        // IMPLEMENT_HERE
        setCookie('access_token', res.data.access_token)
        setCookie('refresh_token', res.data.refresh_token)
        // const user = await discordAPI.user.info()
        // setCookie('uid', user.id)

        history.push('/')
      } else {
        history.push('/login')
      }
    } catch (err) {
      history.push('/login')
    }
  }

  const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  return (
    <Container>
      <Spin size="large" />
    </Container>
  )
}

export default Validate
