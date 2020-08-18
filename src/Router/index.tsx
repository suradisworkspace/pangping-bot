import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Login from '~/containers/Login'
import Validate from '~/containers/Validate'
import Home from '~/containers/Home'
import Layout from '~/containers/Layout'

const RouterContainer = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['access_token'])
  const AuthRoute = ({ children, ...rest }: RouteProps) => (
    <Route
      {...rest}
      render={({ location }) => {
        return !!cookies.access_token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
  const UnAuthRoute = ({ children, ...rest }: RouteProps) => {
    return (
      <Route
        {...rest}
        render={({ location }) => {
          return !cookies.access_token ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          )
        }}
      />
    )
  }

  return (
    <Router>
      <Switch>
        <UnAuthRoute path="/login" children={<Login />} />
        <Route path="/validate" component={Validate} />
        <AuthRoute path="/">
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/guild/:id" component={Home} />
          </Layout>
        </AuthRoute>
      </Switch>
    </Router>
  )
}

// export default connector(RouterContainer)
export default RouterContainer
