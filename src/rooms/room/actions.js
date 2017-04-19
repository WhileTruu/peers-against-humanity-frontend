import ApiService from '../../services/apiService'
import DataChannelService from '../../services/webRTCDataChannel'

export const ROOM_REQUEST = 'ROOM_REQUEST'
export const JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS'
export const EXIT_ROOM_SUCCESS = 'EXIT_ROOM_SUCCESS'
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS'
export const ROOM_REQUEST_ERROR = 'ROOM_REQUEST_ERROR'
export const UPDATE_ROOM_MEMBERS = 'UPDATE_ROOM_MEMBERS'

function roomRequest() {
  return { type: ROOM_REQUEST }
}

function roomRequestError(error) {
  return { type: ROOM_REQUEST_ERROR, error }
}

export function joinRoom(roomId, userId, token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.joinRoom(roomId, userId, token)
      .then((room) => {
        dispatch({ type: JOIN_ROOM_SUCCESS, room })
        ApiService.getRoomMembers(room.id)
          .then((members) => {
            Object.keys(members)
              .forEach(key => DataChannelService.requestNewPeerConnection(key))
          })
          .catch(error => dispatch(roomRequestError(error)))
      })
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

export function updateMembers(members) {
  return (dispatch) => {
    Object.keys(members)
      .forEach((key) => {
        if (!members[key].active) DataChannelService.removePeer(key)
      })
    dispatch({ type: UPDATE_ROOM_MEMBERS, members })
  }
}
