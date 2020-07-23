import { combineReducers } from 'redux'
import auth from './auth/reducers'

const rootReducer = combineReducers({
  auth,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
