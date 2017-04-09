import ApiService from '../services/apiService'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOG_OUT = 'LOG_OUT'

export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    token: user.token,
    username: user.username,
    id: user.id,
  }
}

export function loginRequest(username, password) {
  return {
    type: LOGIN_REQUEST,
    username,
    password,
  }
}

export function loginError(error) {
  return {
    type: LOGIN_FAILURE,
    error,
  }
}

export function requestLogin({ username, password }) {
  return (dispatch) => {
    dispatch(loginRequest(username, password))
    ApiService.login({ username, password })
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}

export function logOut() {
  return (dispatch) => {
    dispatch({ type: LOG_OUT })
  }
}

export function register({ username, password }) {
  return (dispatch) => {
    dispatch(loginRequest(username, password))
    ApiService.register({ username, password })
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}
