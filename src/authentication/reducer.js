import { LOG_IN, LOG_OUT, LOGGED_IN } from './actions'

const initialState = {
  token: null,
  username: null,
  userId: null,
  authenticated: false,
}

export default function authentication(state = initialState, result) {
  switch (result.type) {
    case LOG_IN: {
      localStorage.setItem('token', result.token)
      localStorage.setItem('userId', result.userId)
      localStorage.setItem('username', result.username)
      return {
        token: result.token,
        username: result.username,
        userId: parseInt(result.userId, 10),
        authenticated: true,
      }
    }
    case LOG_OUT: {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      return {
        token: null,
        username: null,
        userId: null,
        authenticated: false,
      }
    }
    case LOGGED_IN: {
      return {
        token: result.token,
        username: result.username,
        userId: parseInt(result.userId, 10),
        authenticated: true,
      }
    }
    default:
      return state
  }
}
