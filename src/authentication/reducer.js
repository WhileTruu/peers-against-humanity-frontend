import { LOG_IN, LOG_OUT } from './actions'

const initialState = {
  token: null,
  authenticated: false,
}

export default function authentication(state = initialState, result) {
  switch (result.type) {
    case LOG_IN: {
      window.localStorage.setItem('token', result.token)
      return {
        token: result.token,
        authenticated: true,
      }
    }
    case LOG_OUT: {
      window.localStorage.removeItem('token')
      return {
        token: null,
        authenticated: false,
      }
    }
    default:
      return state
  }
}
