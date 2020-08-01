import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import crypto from 'crypto'
import DiscordOauth2 from 'discord-oauth2'
import discordClient from '~/discordOauth'
console.log('process.evn :>> ', process.env)

const oauth = new DiscordOauth2({
  clientId: discordClient.clientId,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
})

const Background = styled.div`
  background: rgb(44, 62, 80);
  background: linear-gradient(180deg, rgba(44, 62, 80, 1) 0%, rgba(253, 116, 108, 1) 100%);
  width: 100vw;
  min-height: 100vh;
`

const LoginContainer = styled.div`
  background: white;
  align-self: center;
  min-width: 500px;
  min-height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 8px;
`

const LoginTitle = styled.h1`
  text-align: center;
`

const Login = () => {
  const login = () => {
    const url = oauth.generateAuthUrl({
      scope: ['identify'],
      state: crypto.randomBytes(16).toString('hex'), // Be aware that randomBytes is sync if no callback is provided
    })
    window.open(url, '_self')
  }
  useEffect(() => {
    // const accessToken = localStorage.getItem('accessToken')
    // if (!!accessToken) {
    //   history.push('/')
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Background>
      <LoginContainer>
        <LoginTitle>Sign-In</LoginTitle>
        <Button onClick={login} type="primary">
          Sign-In with Discord
        </Button>
      </LoginContainer>
    </Background>
  )
}

export default Login
