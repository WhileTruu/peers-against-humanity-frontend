import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './actions'

const initialState = {
  isFetching: false,
  isAuthenticated: false,
  errorStatusCode: null,
  user: {
    token: null,
    userId: null,
    username: null,
    password: null,
  },
}

export default function authentication(state = initialState, result) {
  switch (result.type) {
    case LOGIN_REQUEST: {
      return {
        ...initialState,
        isFetching: true,
        isAuthenticated: false,
        errorStatusCode: null,
        user: {
          ...initialState.user,
          username: result.username,
          password: result.password,
        },
      }
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorStatusCode: null,
        user: {
          ...state.user,
          token: result.token,
          userId: result.id,
          username: result.username,
        },
      }
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorStatusCode: result.error.response.status,
      }
    }
    default:
      return state
  }
}
