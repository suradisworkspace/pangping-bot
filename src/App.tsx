import React from 'react'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
// import createStore from '~/configs/configureStore'
import Router from '~/Router'
import 'antd/dist/antd.css'

// const { store, persistor } = createStore()

// const App = () => (
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <Router />
//     </PersistGate>
//   </Provider>
// )

const App = () => <Router />

export default App
