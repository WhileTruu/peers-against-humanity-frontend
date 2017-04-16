import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOG_OUT } from './actions'

const initialState = {
  isFetching: false,
  isAuthenticated: false,
  errorStatusCode: null,
  token: null,
  user: null,
}

// const initialUserState = {
//   id: null,
//   username: null,
//   nickname: null,
//   registered: true,
// }


export default function authentication(state = initialState, result) {
  switch (result.type) {
    case LOG_OUT: {
      return initialState
    }
    case LOGIN_REQUEST: {
      return {
        ...initialState,
        isFetching: true,
        user: null,
      }
    }
    case LOGIN_SUCCESS: {
      const { id, username, registered, nickname } = result.user
      return {
        isFetching: false,
        isAuthenticated: true,
        errorStatusCode: null,
        token: result.token,
        user: { id, username, registered, nickname },
      }
    }
    case LOGIN_FAILURE: {
      return {
        isFetching: false,
        isAuthenticated: false,
        errorStatusCode: result.error.response.status,
        token: null,
        user: null,
      }
    }
    default:
      return state
  }
}
