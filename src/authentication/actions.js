// export const LOG_IN = 'LOG_IN'
// export const LOG_OUT = 'LOG_OUT'
// export const LOGGED_IN = 'LOGGED_IN'
//
// export function logIn({ token, userId, username }) {
//   return (dispatch) => {
//     dispatch({ type: LOG_IN, token, userId, username })
//   }
// }
//
// export function logOut() {
//   return (dispatch) => {
//     dispatch({ type: LOG_OUT })
//   }
// }
//
// export function loggedIn({ token, userId, username }) {
//   return (dispatch) => {
//     dispatch({ type: LOGGED_IN, token, userId, username })
//   }
// }
//
// export function updateLogInStatus() {
//   const token = localStorage.getItem('token')
//   const userId = localStorage.getItem('userId')
//   const username = localStorage.getItem('username')
//
//   if (!!token && !!userId && !!username) {
//     return loggedIn({ token, userId, username })
//   }
//   return logOut()
// }
import ApiService from '../services/apiService'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    token: user.token,
    username: user.username,
    id: user.id,
  }
}

export function loginError(error) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    error,
  }
}

export function requestLogin({ username, password }) {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      username,
      password,
    })
    ApiService.loginUser({ username, password })
      .then(response => dispatch(receiveLogin(response)))
      .catch(error => dispatch(loginError(error)))
  }
}
