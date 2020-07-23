import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Login from '~/containers/Login'

const isAuth = false

const AuthRoute = ({ children, ...rest }: { children: React.ReactNode }) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuth ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      )
    }
  />
)

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
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
