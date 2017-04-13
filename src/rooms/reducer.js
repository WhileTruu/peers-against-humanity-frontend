// import DataChannelService from '../services/webRTCDataCHannel'
import {
  UPDATE_ROOM,
  UPDATE_ROOMS,
  ROOM_REQUEST,
  ROOM_REQUEST_FAILURE,
  CREATE_ROOM_SUCCESS,
  JOIN_ROOM_SUCCESS,
  EXIT_ROOM_SUCCESS,
} from './actions'

const initialState = {
  isFetching: false,
  currentRoomId: null,
  rooms: null,
  errorStatusCode: null,
}

function updateRoom(state, room) {
  if (state.rooms) {
    const { [`${room.id}`]: deletedRoom, ...rooms } = state.rooms
    if (room.finished) return { ...state, rooms }
    return {
      ...state,
      rooms: { [`${room.id}`]: room, ...rooms },
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

export default function socketService(state = initialState, result) {
  switch (result.type) {
    case ROOM_REQUEST: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case UPDATE_ROOM: {
      return updateRoom(state, result.room)
    }
    case UPDATE_ROOMS: {
      return {
        ...state,
        rooms: result.rooms,
        errorStatusCode: null,
        isFetching: false,
      }
    }
    case JOIN_ROOM_SUCCESS: {
      const newState = updateRoom(state, result.room)
      return {
        ...newState,
        currentRoomId: result.room.id,
      }
    }
    case CREATE_ROOM_SUCCESS: {
      const newState = updateRoom(state, result.room)
      return {
        ...newState,
        currentRoomId: result.room.id,
      }
    }
    case EXIT_ROOM_SUCCESS: {
      return { ...state, currentRoomId: null, errorStatusCode: null, isFetching: false }
    }
    case ROOM_REQUEST_FAILURE: {
      return { ...state, errorStatusCode: result.error.response.status, isFetching: false }
    }
    default:
      return state
  }
}
