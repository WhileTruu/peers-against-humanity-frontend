import {
  CHANGE_NICKNAME,
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
} from './constants'

const USER_INFO_STORAGE_KEY = 'user'

const user = (
  window.localStorage &&
  JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY))
) || null

const initialState = {
  nickname: (user && user.nickname) || '',
  username: '',
  password: '',
}

export default function register(state = initialState, action) {
  switch (action.type) {

    case CHANGE_NICKNAME:
      return { ...state, nickname: action.username }

    case CHANGE_USERNAME:
      return { ...state, username: action.username }

    case CHANGE_PASSWORD:
      return { ...state, password: action.password }

    default:
      return state
  }
}
