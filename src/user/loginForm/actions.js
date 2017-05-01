import {
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
  TOGGLE_REMEMBER_LOGIN,
} from './constants'

export function changeUsername(username) {
  return { type: CHANGE_USERNAME, username }
}

export function changePassword(password) {
  return { type: CHANGE_PASSWORD, password }
}

export function toggleRememberLogin() {
  return { type: TOGGLE_REMEMBER_LOGIN }
}
