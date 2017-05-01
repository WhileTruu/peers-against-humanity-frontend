import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  LOG_OUT,
} from './constants'
import { api } from '../common'

export function logIn(username, password) {
  return (dispatch) => {
    dispatch({ type: GET_USER_START })
    api
      .login(username, password)
      .then((response) => {
        dispatch({ type: GET_USER_SUCCESS, user: response.user, token: response.token })
      })
      .catch(error => dispatch({ type: GET_USER_ERROR, error }))
  }
}

export function register(username, password) {
  return (dispatch) => {
    dispatch({ type: GET_USER_START })
    api
      .register(username, password)
      .then((response) => {
        dispatch({ type: GET_USER_SUCCESS, user: response.user, token: response.token })
      })
      .catch(error => dispatch({ type: GET_USER_ERROR, error }))
  }
}

export function temporaryRegister(nickname) {
  return (dispatch) => {
    dispatch({ type: GET_USER_START })
    api
      .createTemporaryAccount(nickname)
      .then((response) => {
        dispatch({ type: GET_USER_SUCCESS, user: response.user, token: response.token })
      })
      .catch(error => dispatch({ type: GET_USER_ERROR, error }))
  }
}

export function logOut() {
  return { type: LOG_OUT }
}
