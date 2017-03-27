import {
  SOCKET_IS_OPEN,
  SOCKET_IS_CLOSED,
  SOCKET_UPDATE_ROOM,
  SOCKET_UPDATE_AVAILABLE_ROOMS,
} from './actions'

const initialState = {
  isOpen: false,
  room: null,
  availableRooms: null,
}

export default function socketService(state = initialState, result) {
  switch (result.type) {
    case SOCKET_IS_OPEN: {
      return {
        ...state,
        isOpen: true,
      }
    }
    case SOCKET_IS_CLOSED: {
      return {
        ...state,
        isOpen: false,
      }
    }
    case SOCKET_UPDATE_ROOM: {
      return {
        ...state,
        room: result.room,
      }
    }
    case SOCKET_UPDATE_AVAILABLE_ROOMS: {
      return {
        ...state,
        availableRooms: result.availableRooms,
      }
    }
    default:
      return state
  }
}
