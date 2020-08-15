import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from 'react-router-dom'
// import { connect, ConnectedProps } from 'react-redux'
// import { RootState } from '~/redux'
import { useCookies } from 'react-cookie'
import Login from '~/containers/Login'
import Validate from '~/containers/Validate'
import Home from '~/containers/Home'
import Layout from '~/containers/Layout'

// const mapStateToProps = (state: RootState) => ({ auth: state.auth })
// const mapDispatchToProps = {}
// const connector = connect(mapStateToProps, mapDispatchToProps)
// type ReduxProps = ConnectedProps<typeof connector>
// type Props = ReduxProps & {}

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
          </Layout>
        </AuthRoute>
      </Switch>
    </Router>
  )
}

// export default connector(RouterContainer)
export default RouterContainer
