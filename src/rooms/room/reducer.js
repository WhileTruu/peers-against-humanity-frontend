import {
  CREATE_ROOM,
  JOIN_ROOM,
  EXIT_ROOM,
  ROOM_NOT_CREATED,
  ROOM_NOT_JOINED,
  ROOM_NOT_EXITED,
  JOINED_ROOM,
  EXITED_ROOM,
  CREATED_ROOM,
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
    case JOIN_ROOM:
      return { ...initialState, id: result.id, isFetching: true }
    case CREATE_ROOM:
      return { ...initialState, isFetching: true }
    case EXIT_ROOM:
      return { ...initialState, members: state.members, isFetching: true }
    case ROOM_NOT_CREATED: case ROOM_NOT_JOINED: case ROOM_NOT_EXITED:
      return { ...initialState, error: result.error }
    case JOINED_ROOM:
      return { ...state, ...result.room, members: state.members, isFetching: false, error: null }
    case EXITED_ROOM:
      return { ...initialState, members: state.members }
    case CREATED_ROOM:
      return { ...state, ...result.room, isFetching: false, error: null }
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
    case 'UPDATE_ROOM': {
      if (state.id === result.room.id) {
        return { ...state, ...result.room }
      }
      return state
    }
    default:
      return state
  }
}
