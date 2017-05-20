import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  LOG_OUT,
  TOGGLE_REMEMBER_LOGIN,
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

export function register(nickname, username, password) {
  return (dispatch, getState) => {
    dispatch({ type: GET_USER_START })
    const userId = (getState().user && getState().user.id)
    if (userId) {
      api
        .registerTemporary(userId, nickname, username, password, getState().user.token)
        .then((response) => {
          dispatch({ type: GET_USER_SUCCESS, user: response.user, token: response.token })
        })
        .catch(error => dispatch({ type: GET_USER_ERROR, error }))
    } else {
      api
        .register(nickname, username, password)
        .then((response) => {
          dispatch({ type: GET_USER_SUCCESS, user: response.user, token: response.token })
        })
        .catch(error => dispatch({ type: GET_USER_ERROR, error }))
    }
  }
}

export function temporaryLogin(nickname) {
  return (dispatch, getState) => {
    if (getState().user.loading) return
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

export function toggleRememberLogin() {
  return { type: TOGGLE_REMEMBER_LOGIN }
}
