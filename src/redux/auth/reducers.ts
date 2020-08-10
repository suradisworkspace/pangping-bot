import ACTION from './actionType'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
}

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
}

const auth = (state = initialState, action: { type: string; payload?: object }): AuthState => {
  switch (action.type) {
    case ACTION.SET_TOKEN:
      return {
        ...state,
        ...action.payload,
      }
    case ACTION.REMOVE_TOKEN:
      return initialState

    default:
      return state
  }
}

export default auth
