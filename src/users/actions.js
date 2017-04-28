import ApiService from '../services/apiService'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOG_OUT = 'LOG_OUT'

function saveToLocalStorage(data) {
  Object.keys(data).forEach(key => localStorage.setItem(key, data[key]))
}

export function receiveLogin(result) {
  return (dispatch) => {
    if (localStorage.getItem('rememberLogin')) {
      saveToLocalStorage({ user: JSON.stringify(result.user), token: result.token })
    }
    dispatch({ type: LOGIN_SUCCESS, ...result })
  }
}

export function loginRequest() {
  return { type: LOGIN_REQUEST }
}

export function loginError(error) {
  return { type: LOGIN_FAILURE, error }
}

export function requestLogin({ username, password }) {
  return (dispatch) => {
    dispatch(loginRequest())
    ApiService.login({ username, password })
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}

export function logOut() {
  return (dispatch) => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    dispatch({ type: LOG_OUT })
  }
}

export function register({ username, password }) {
  return (dispatch) => {
    dispatch(loginRequest())
    ApiService.register({ username, password })
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}

export function createTemporaryAccount(nickname) {
  return (dispatch) => {
    dispatch(loginRequest())
    ApiService.createTemporaryAccount(nickname)
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}

export function checkRememberedLogin() {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  return (dispatch) => {
    if (!user || !token) return //eslint-disable-line
    dispatch(receiveLogin({ user, token }))
  }
}
