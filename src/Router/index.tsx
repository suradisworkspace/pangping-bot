import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import Login from '~/containers/Login'
import Validate from '~/containers/Validate'
import { RootState } from '~/redux'
const mapStateToProps = (state: RootState) => ({ auth: state.auth })
const mapDispatchToProps = {}
const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & {}

const RouterContainer = (props: Props) => {
  console.log('props :>> ', props)
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
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/validate">
          <Validate />
        </Route>
        <AuthRoute>
          <Route exact path="/">
            <div>
              <h1>login here</h1>
            </div>
          </Route>
        </AuthRoute>
      </Switch>
    </Router>
  )
}

export default connector(RouterContainer)
