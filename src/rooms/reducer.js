import {
  UPDATE_LIST_ROOM,
  UPDATE_LIST_ROOMS,
} from './actions'

const initialState = {
  rooms: null,
}

function updateRoom(state, room) {
  if (state.rooms) {
    const { [`${room.id}`]: deletedRoom, ...remainingRooms } = state.rooms
    if (room.finished) return { ...state, rooms: remainingRooms }
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

export default function rooms(state = initialState, result) {
  switch (result.type) {
    case UPDATE_LIST_ROOM: {
      return updateRoom(state, result.room)
    }
    case UPDATE_LIST_ROOMS: {
      return {
        ...state,
        rooms: result.rooms,
      }
    }
    default:
      return state
  }
}
