import React, { useCallback, useEffect, useState } from 'react'
import { Provider } from 'mobx-react'
import store, { hydratedStore } from '~/store'
import Router from '~/Router'
import 'antd/dist/antd.css'

const App = () => {
  const [appLoaded, setAppLoaded] = useState(false)
  useEffect(() => {
    preload()
  }, [])

  const preload = useCallback(async () => {
    await Promise.all([...(hydratedStore as Promise<any>[])])
    setAppLoaded(true)
  }, [])

  if (!appLoaded) {
    return <div></div>
  }

  return (
    <Provider {...store}>
      <Router />
    </Provider>
  )
}

export default App
