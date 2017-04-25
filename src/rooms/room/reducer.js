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
  errorStatusCode: null,
}

export default function room(state = initialState, result) {
  switch (result.type) {
    case ROOM_REQUEST:
      if (result.room) return { ...state, ...result.room, isFetching: true }
      return { ...state, isFetching: true }
    case JOIN_ROOM_SUCCESS:
      return { ...state, ...result.room, isFetching: false, errorStatusCode: null }
    case EXIT_ROOM_SUCCESS:
      return initialState
    case CREATE_ROOM_SUCCESS:
      return { ...state, ...result.room, isFetching: false, errorStatusCode: null }
    case ROOM_REQUEST_ERROR:
      return { ...state, isFetching: false, errorStatusCode: result.error.response.statusCode }
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
