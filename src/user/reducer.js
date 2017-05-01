import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  LOG_OUT,
} from './constants'

const TOKEN_STORAGE_KEY = 'token'
const USER_INFO_STORAGE_KEY = 'user'

const user = (
  window.localStorage &&
  JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY))
) || null
const token = (window.localStorage && localStorage.getItem(TOKEN_STORAGE_KEY)) || null

const initialState = {
  isLoggedIn: !!user && !!token,
  loading: false,
  error: null,
  user,
  token,
}

export default function login(state = initialState, action) {
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
        user: action.user,
        token: action.token,
        error: null,
        isLoggedIn: true,
      }

    case GET_USER_ERROR:
      return { ...state, loading: false, error: action.error.status }

    case LOG_OUT:
      if (window.localStorage) localStorage.removeItem(TOKEN_STORAGE_KEY)
      return initialState

    default:
      return state
  }
}
