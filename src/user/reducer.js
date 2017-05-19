import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  LOG_OUT,
  TOGGLE_REMEMBER_LOGIN,
} from './constants'

const REMEMBER_LOGIN_STORAGE_KEY = 'rememberLogin'
const TOKEN_STORAGE_KEY = 'token'
const USER_INFO_STORAGE_KEY = 'user'

const rememberLogin = (
  window.localStorage &&
  JSON.parse(localStorage.getItem(REMEMBER_LOGIN_STORAGE_KEY))
) || false
const user = (
  window.localStorage &&
  JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY))
) || null
const token = (window.localStorage && localStorage.getItem(TOKEN_STORAGE_KEY)) || null

const initialState = (initialUser, initialToken) => ({
  isLoggedIn: !!(initialUser && initialUser.id) && !!initialToken,
  loading: false,
  error: null,
  rememberLogin,

  id: (initialUser && initialUser.id) || null,
  token: initialToken,
  createdAt: (initialUser && initialUser.createdAt) || null,
  username: (initialUser && initialUser.username) || null,
  nickname: (initialUser && initialUser.nickname) || null,
  registered: (initialUser && initialUser.registered) || null,
})

export default function login(state = initialState(user, token), action) {
  switch (action.type) {

    case GET_USER_START:
      return { ...state, loading: true, error: null }

    case GET_USER_SUCCESS:
      if (window.localStorage && state.rememberLogin) {
        localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(action.user))
        localStorage.setItem(TOKEN_STORAGE_KEY, action.token)
      }
      return {
        ...state,
        loading: false,
        ...action.user,
        token: action.token,
        error: null,
        isLoggedIn: true,
      }

    case GET_USER_ERROR:
      return { ...state, loading: false, error: action.error.status }

    case LOG_OUT:
      if (window.localStorage) {
        localStorage.removeItem(REMEMBER_LOGIN_STORAGE_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(USER_INFO_STORAGE_KEY)
      }

      return initialState(null, null)

    case TOGGLE_REMEMBER_LOGIN:
      if (window.localStorage) {
        localStorage.setItem(REMEMBER_LOGIN_STORAGE_KEY, !state.rememberLogin)
      }
      return { ...state, rememberLogin: !state.rememberLogin }

    default:
      return state
  }
}
