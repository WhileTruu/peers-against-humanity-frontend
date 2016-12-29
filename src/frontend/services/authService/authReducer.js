import { AUTHENTICATED, NOT_AUTHENTICATED } from './authActions'

const initialState = {
  isAuthenticated: false,
}

export default function authentication(state = initialState, result) {
  switch(result.type) {
    case AUTHENTICATED: {
      return {
        isAuthenticated: true,
      }
    }
    case NOT_AUTHENTICATED: {
      return {
        isAuthenticated: false,
      }
    }
    default:
      return state
  }
}
