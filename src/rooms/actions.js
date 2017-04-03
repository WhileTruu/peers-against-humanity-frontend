import ApiService from '../services/apiService'

export const ROOMS_UPDATE_ROOM = 'ROOMS_UPDATE_ROOM'
export const ROOMS_UPDATE_AVAILABLE_ROOMS = 'ROOMS_UPDATE_AVAILABLE_ROOMS'
export const ROOMS_JOIN_ROOM = 'ROOMS_JOIN_ROOM'
export const ROOMS_EXIT_ROOM = 'ROOMS_EXIT_ROOM'
export const ROOMS_ERROR = 'ROOMS_ERROR'

export function updateRoom(room) {
  return dispatch => (
    dispatch({ type: ROOMS_UPDATE_ROOM, room })
  )
}

export function updateAvailableRooms(availableRooms) {
  return dispatch => (
    dispatch({ type: ROOMS_UPDATE_AVAILABLE_ROOMS, availableRooms })
  )
}

export function createRoom() {
  return (dispatch) => {
    ApiService.createRoom()
      .then((room) => {
        dispatch({ type: ROOMS_JOIN_ROOM, id: room.id })
        // TODO: think about updating the room twice maybe?
        // dispatch({ type: ROOMS_UPDATE_ROOM, room })
      })
      .catch(() => dispatch({ type: ROOMS_ERROR }))
  }
}

export function joinRoom(id) {
  return dispatch => (
    dispatch({ type: ROOMS_JOIN_ROOM, id })
  )
}

export function exitRoom(id) {
  return (dispatch) => {
    ApiService.exitRoom(id)
      .then(() => {
        dispatch({ type: ROOMS_EXIT_ROOM })
        // TODO: think about updating the room twice maybe?
        // dispatch({ type: ROOMS_UPDATE_ROOM, room })
      })
      .catch(() => dispatch({ type: ROOMS_ERROR }))
  }
}

export function roomError() {
  return dispatch => (
    dispatch({ type: ROOMS_ERROR })
  )
}
