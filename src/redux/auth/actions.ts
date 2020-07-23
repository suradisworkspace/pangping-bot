import ACTION from './actionType'

export const setToken = (accessToken: string, refreshToken: string) => ({
  type: ACTION.SET_TOKEN,
  payload: {
    accessToken,
    refreshToken,
  },
})
