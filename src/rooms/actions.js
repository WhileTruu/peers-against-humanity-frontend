import ApiService from '../services/apiService'

export const UPDATE_ROOM = 'UPDATE_ROOM'
export const UPDATE_ROOMS = 'UPDATE_ROOMS'
export const ROOM_REQUEST = 'ROOM_REQUEST'
export const ROOM_REQUEST_FAILURE = 'ROOM_REQUEST_FAILURE'
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS'
export const JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS'
export const EXIT_ROOM_SUCCESS = 'EXIT_ROOM_SUCCESS'

export function roomRequest() {
  return { type: ROOM_REQUEST }
}

export function roomRequestError(error) {
  return { type: ROOM_REQUEST_FAILURE, error }
}

export function updateRoom(room) {
  return { type: UPDATE_ROOM, room }
}

export function updateRooms(availableRooms) {
  return { type: UPDATE_ROOMS, availableRooms }
}

export function createRoom(token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.createRoom(token)
      .then(room => (
        dispatch({ type: CREATE_ROOM_SUCCESS, room })
      ))
      .catch(error => dispatch(roomRequestError(error)))
  }
}

export function joinRoom(roomId, userId, token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.joinRoom(roomId, userId, token)
      .then(room => (
        dispatch({ type: JOIN_ROOM_SUCCESS, room })
      ))
      .catch(error => dispatch(roomRequestError(error)))
  }
}

export function exitRoom(roomId, userId, token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.exitRoom(roomId, userId, token)
      .then(() => (
        dispatch({ type: EXIT_ROOM_SUCCESS })
      ))
      .catch(error => dispatch(roomRequestError(error)))
  }
}
