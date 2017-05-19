import {
  UPDATE_ROOM,
  UPDATE_ROOMS,
  CREATE_ROOM,
  JOIN_ROOM,
  EXITED_ROOM,
  ROOM_NOT_CREATED,
  ROOM_NOT_JOINED,
  ROOM_NOT_EXITED,
  JOINED_ROOM,
  CREATED_ROOM,
  UPDATE_ROOM_OWNER,
} from './actions'

const initialState = {
  room: null,
  rooms: null,
  isFetching: false,
  error: null,
}

function updateRoom(state, room) {
  if (state.rooms) {
    const { [`${room.id}`]: deletedRoom, ...remainingRooms } = state.rooms
    if (!room.active) return { ...state, rooms: remainingRooms }
    return {
      ...state,
      rooms: { [`${room.id}`]: room, ...remainingRooms },
      errorStatusCode: null,
      isFetching: false,
    }
  }
  return {
    ...state,
    rooms: { [`${room.id}`]: room, ...state.rooms },
    errorStatusCode: null,
    isFetching: false,
  }
}

export default function rooms(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ROOM: {
      if (state.room && action.room.id === state.room.id) {
        return { ...updateRoom(state, action.room), room: { ...action.room } }
      }
      return updateRoom(state, action.room)
    }
    case UPDATE_ROOMS: {
      return {
        ...state,
        rooms: action.rooms,
      }
    }
    case UPDATE_ROOM_OWNER: {
      return {
        ...state,
        room: {
          ...state.room,
          ownerId: action.id,
          ownerNickname: action.ownerNickname,
          ownerUsername: action.ownerUsername,
        },
      }
    }
    case JOIN_ROOM: case CREATE_ROOM:
      return { ...state, isFetching: true }
    case ROOM_NOT_CREATED: case ROOM_NOT_JOINED: case ROOM_NOT_EXITED:
      return { ...state, room: null, isFetching: false, error: action.error }
    case JOINED_ROOM: case CREATED_ROOM:
      return { ...state, isFetching: false, error: null, room: action.room }
    case EXITED_ROOM:
      return { ...state, isFetching: false, error: null, room: null }
    default:
      return state
  }
}
