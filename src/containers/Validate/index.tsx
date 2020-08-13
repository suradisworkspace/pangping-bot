import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import queryString from 'query-string'
import discordClient from '~/discordOauth'
import axios from 'axios'

// const mapStateToProps = (state: RootState) => ({ auth: state.auth })
// const mapDispatchToProps = { setToken }
// const connector = connect(mapStateToProps, mapDispatchToProps)
// type ReduxProps = ConnectedProps<typeof connector>
// type Props = ReduxProps & {}

const Validate = () => {
  const location = useLocation()
  const history = useHistory()
  const [cookies, setCookie, removeCookie] = useCookies()
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
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
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
        // localStorage.setItem('accessToken', res.data.access_token)
        // localStorage.setItem('refreshToken', res.data.refresh_token)
        console.log('res.data :>> ', res.data)
        setCookie('accessToken', res.data.access_token)
        setCookie('refreshToken', res.data.refresh_token)
        history.push('/')
      } else {
        console.log('res :>> ', res)
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
