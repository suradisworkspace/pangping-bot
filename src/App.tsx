import React from 'react'
import { Provider } from 'mobx-react'
import store from '~/store'
import Router from '~/Router'
import 'antd/dist/antd.css'

const App = () => (
  <Provider {...store}>
    <Router />
  </Provider>
)

export default App
