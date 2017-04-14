import {
  ROOM_REQUEST,
  JOIN_ROOM_SUCCESS,
  EXIT_ROOM_SUCCESS,
  CREATE_ROOM_SUCCESS,
  ROOM_REQUEST_ERROR,
  UPDATE_ROOM_MEMBERS,
} from './actions'

const initialState = {
  room: {
    id: null,
    creatorId: null,
    ownerId: null,
    started: false,
    finished: false,
    createdAt: null,
    ownerUsername: null,
  },
  members: null,
  isFetching: false,
  errorStatusCode: null,
}

export default function room(state = initialState, result) {
  switch (result.type) {
    case ROOM_REQUEST:
      return { ...state, isFetching: true }
    case JOIN_ROOM_SUCCESS:
      return { ...state, room: result.room, isFetching: false, errorStatusCode: null }
    case EXIT_ROOM_SUCCESS:
      return initialState
    case CREATE_ROOM_SUCCESS:
      return { ...state, room: result.room, isFetching: false, errorStatusCode: null }
    case ROOM_REQUEST_ERROR:
      return { ...state, isFetching: false, errorStatusCode: result.error.response.statusCode }
    case UPDATE_ROOM_MEMBERS:
      return {
        ...state,
        members: result.members,
      }
    default:
      return state
  }
}
