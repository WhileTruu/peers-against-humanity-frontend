import {
  ROOM_REQUEST,
  JOIN_ROOM_SUCCESS,
  EXIT_ROOM_SUCCESS,
  CREATE_ROOM_SUCCESS,
  ROOM_REQUEST_ERROR,
  ADD_MEMBER,
  REMOVE_MEMBER,
  HAS_DATA_CHANNEL,
} from './actions'

const initialState = {
  id: null,
  ownerId: null,
  active: false,
  createdAt: null,
  ownerUsername: null,
  ownerNickname: null,
  members: null,
  isFetching: false,
  error: null,
}

export default function room(state = initialState, result) {
  switch (result.type) {
    case CREATE_ROOM:
    case JOIN_ROOM:
    case EXIT_ROOM:
      return { ...state, isFetching: true }
    case JOINED_ROOM:
      return { ...state, ...result.room, isFetching: false, error: null }
    case EXITED_ROOM:
      return initialState
    case CREATED_ROOM:
      return { ...state, ...result.room, isFetching: false, error: null }
    case ERROR:
      return { ...state, isFetching: false, error: result.error }
    case ADD_MEMBER:
      return {
        ...state,
        members: {
          ...state.members,
          [result.member.id]: { ...result.member, hasDataChannel: false },
        },
      }
    case REMOVE_MEMBER: {
      const { [`${result.id}`]: deletedMember, ...members } = state.members
      return { ...state, members }
    }
    case HAS_DATA_CHANNEL:
      return {
        ...state,
        members: {
          ...state.members,
          [result.id]: { ...state.members[result.id], hasDataChannel: true },
        },
      }
    default:
      return state
  }
}
