import ApiService from '../../services/apiService'
import DataChannelService from '../../services/webRTCDataChannel'

export const ADD_MEMBER = 'ADD_MEMBER'
export const REMOVE_MEMBER = 'REMOVE_MEMBER'
export const ROOM_REQUEST = 'ROOM_REQUEST'
export const JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS'
export const EXIT_ROOM_SUCCESS = 'EXIT_ROOM_SUCCESS'
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS'
export const ROOM_REQUEST_ERROR = 'ROOM_REQUEST_ERROR'
export const HAS_DATA_CHANNEL = 'HAS_DATA_CHANNEL'

function roomRequest() {
  return { type: ROOM_REQUEST }
}

function roomRequestError(error) {
  return { type: ROOM_REQUEST_ERROR, error }
}

export function joinRoom(roomId, token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.joinRoom(roomId, token)
      .then((room) => {
        dispatch({ type: ROOM_REQUEST, room })
      })
      .catch(error => dispatch(roomRequestError(error)))
  }
}

export function addMember(member) {
  return { type: ADD_MEMBER, member }
}

export function removeMember(id) {
  return { type: REMOVE_MEMBER, id }
}

export function hasDataChannel(id) {
  return { type: HAS_DATA_CHANNEL, id }
}

export function exitRoom() {
  return (dispatch) => {
    DataChannelService.closeAllPeerConnections()
    dispatch({ type: EXIT_ROOM_SUCCESS })
  }
}

export function ownerExitRoom(roomId, token) {
  return (dispatch) => {
    dispatch(roomRequest())
    DataChannelService.closeAllPeerConnections()
    ApiService.exitRoom(roomId, token)
      .then(() => {
        dispatch({ type: EXIT_ROOM_SUCCESS })
      })
      .catch(error => dispatch(roomRequestError(error)))
  }
}

export function createRoom(token) {
  return (dispatch) => {
    dispatch(roomRequest())
    ApiService.createRoom(token)
      .then((room) => {
        dispatch({ type: CREATE_ROOM_SUCCESS, room })
      })
      .catch(error => dispatch(roomRequestError(error)))
  }
}
