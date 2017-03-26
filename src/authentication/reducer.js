import { LOG_IN, LOG_OUT } from './actions'

const initialState = {
  token: null,
  username: null,
  userId: null,
  authenticated: false,
}

export default function authentication(state = initialState, result) {
  switch (result.type) {
    case LOG_IN: {
      window.localStorage.setItem('token', result.token)
      window.localStorage.setItem('userId', result.userId)
      window.localStorage.setItem('username', result.username)
      return {
        token: result.token,
        username: result.username,
        userId: result.userId,
        authenticated: true,
      }
    }
    case LOG_OUT: {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('userId')
      window.localStorage.removeItem('username')
      return {
        token: null,
        username: null,
        userId: null,
        authenticated: false,
      }
    }
    default:
      return state
  }
}
