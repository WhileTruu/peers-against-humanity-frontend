import {
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
  TOGGLE_REMEMBER_LOGIN,
} from './constants'

const REMEMBER_LOGIN_STORAGE_KEY = 'rememberLogin'

const rememberLogin = (
  window.localStorage &&
  JSON.parse(localStorage.getItem(REMEMBER_LOGIN_STORAGE_KEY))
) || false

const initialState = {
  username: '',
  password: '',
  rememberLogin,
}

export default function login(state = initialState, action) {
  switch (action.type) {

    case CHANGE_USERNAME:
      return { ...state, username: action.username }

    case CHANGE_PASSWORD:
      return { ...state, password: action.password }

    case TOGGLE_REMEMBER_LOGIN:
      if (window.localStorage) {
        localStorage.setItem(REMEMBER_LOGIN_STORAGE_KEY, !state.rememberLogin)
      }
      return { ...state, rememberLogin: !state.rememberLogin }

    default:
      return state
  }
}
