import {
  ROOMS_UPDATE_ROOM,
  ROOMS_UPDATE_AVAILABLE_ROOMS,
  ROOMS_JOIN_ROOM,
  ROOMS_EXIT_ROOM,
  ROOMS_ERROR,
} from './actions'

const initialState = {
  currentRoomId: null,
  availableRooms: null,
  error: false,
}

export default function socketService(state = initialState, result) {
  switch (result.type) {
    case ROOMS_UPDATE_ROOM: {
      const { room } = result
      if (state.availableRooms) {
        const { [`${room.id}`]: deletedRoom, ...availableRooms } = state.availableRooms
        if (room.finished) return { ...state, availableRooms }
        return {
          ...state,
          availableRooms: { [`${room.id}`]: room, ...availableRooms },
          error: false,
        }
      }
      return {
        ...state,
        availableRooms: { [`${room.id}`]: room, ...state.availableRooms },
        error: false,
      }
    }
    case ROOMS_UPDATE_AVAILABLE_ROOMS: {
      return { ...state, availableRooms: result.availableRooms, error: false }
    }
    case ROOMS_JOIN_ROOM: {
      return { ...state, currentRoomId: result.id, error: false }
    }
    case ROOMS_EXIT_ROOM: {
      return { ...state, currentRoomId: null, error: false }
    }
    case ROOMS_ERROR: {
      return { ...state, error: true }
    }
    default:
      return state
  }
}
