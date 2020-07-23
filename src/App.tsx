import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import 'antd/dist/antd.css'

import Login from '~/containers/Login'
import Validate from '~/containers/Validate'

export default function App() {
  const AuthRoute = ({ children, ...rest }: { children: React.ReactNode }) => (
    <Route
      {...rest}
      render={({ location }) => {
        return localStorage.getItem('accessToken') ? (
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
