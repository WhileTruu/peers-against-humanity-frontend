import {
  CHANGE_USERNAME,
  CHANGE_PASSWORD,
} from './constants'

const initialState = {
  username: '',
  password: '',
}

export default function login(state = initialState, action) {
  switch (action.type) {

    case CHANGE_USERNAME:
      return { ...state, username: action.username }

    case CHANGE_PASSWORD:
      return { ...state, password: action.password }

    default:
      return state
  }
}
