import {
  ADD_USER,
  REMOVE_USER,
  HAS_RTC_DATA_CHANNEL,
  EXIT,
} from './constants'

const initialState = {
  users: null,
}

export default function dataChannel(state = initialState, action) {
  switch (action.type) {
    case EXIT: {
      return initialState
    }
    case ADD_USER: {
      const { id } = action
      const { users } = state
      if (users && users[id]) {
        return {
          users: { ...users, [id]: { ...users[id], active: true, hasRTCDataChannel: false } },
        }
      }
      return {
        users: { ...users, [id]: { ...action.user, active: true, hasRTCDataChannel: false } },
      }
    }

    case REMOVE_USER:
      if (!state.users || (state.users && !state.users[action.id])) return state
      return {
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            active: false,
            hasRTCDataChannel: false,
          },
        },
      }

    case HAS_RTC_DATA_CHANNEL:
      return {
        users: {
          ...state.users,
          [action.id]: { ...state.users[action.id], hasRTCDataChannel: true },
        },
      }

    default:
      return state
  }
}
