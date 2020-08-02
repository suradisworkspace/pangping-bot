import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '~/redux'
import Login from '~/containers/Login'
import Validate from '~/containers/Validate'
import Home from '~/containers/Home'
import Layout from '~/containers/Layout'

const mapStateToProps = (state: RootState) => ({ auth: state.auth })
const mapDispatchToProps = {}
const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & {}

const RouterContainer = (props: Props) => {
  const AuthRoute = ({ children, ...rest }: { children: React.ReactNode }) => (
    <Route
      {...rest}
      render={({ location }) => {
        return !!props.auth.accessToken ? (
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

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/validate" component={Validate}></Route>
        <AuthRoute>
          <Route path="/">
            <Layout>
              <Route exact path="/" component={Home} />
            </Layout>
          </Route>
        </AuthRoute>
      </Switch>
    </Router>
  )
}

export default connector(RouterContainer)
