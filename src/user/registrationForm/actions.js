import {
  CHANGE_NICKNAME,
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
} from './constants'

export function changeNickname(username) {
  return { type: CHANGE_NICKNAME, username }
}

export function changeUsername(username) {
  return { type: CHANGE_USERNAME, username }
}

export function changePassword(password) {
  return { type: CHANGE_PASSWORD, password }
}
