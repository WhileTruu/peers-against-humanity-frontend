import DataChannelService from '../../services/webRTCDataChannel'
import { actions as socketActions } from '../../services/socket'

export const ADD_MEMBER = 'ADD_MEMBER'
export const REMOVE_MEMBER = 'REMOVE_MEMBER'
export const HAS_DATA_CHANNEL = 'HAS_DATA_CHANNEL'

export const CREATE_ROOM = 'CREATE_ROOM'
export const JOIN_ROOM = 'JOIN_ROOM'
export const EXIT_ROOM = 'EXIT_ROOM'
export const ROOM_NOT_CREATED = 'ROOM_NOT_CREATED'
export const ROOM_NOT_JOINED = 'ROOM_NOT_JOINED'
export const ROOM_NOT_EXITED = 'ROOM_NOT_EXITED'
export const JOINED_ROOM = 'JOINED_ROOM'
export const EXITED_ROOM = 'EXITED_ROOM'
export const CREATED_ROOM = 'CREATED_ROOM'

export const roomActionTypes = [
  'CREATE_ROOM',
  'JOIN_ROOM',
  'EXIT_ROOM',
  'ROOM_NOT_CREATED',
  'ROOM_NOT_JOINED',
  'ROOM_NOT_EXITED',
  'JOINED_ROOM',
  'EXITED_ROOM',
  'CREATED_ROOM',
]

export function addMember(member) {
  return { type: ADD_MEMBER, member }
}

export function removeMember(id) {
  return { type: REMOVE_MEMBER, id }
}

export function hasDataChannel(id) {
  return { type: HAS_DATA_CHANNEL, id }
}

export function createRoom() {
  return socketActions.send({ type: CREATE_ROOM })
}

export function joinRoom(id) {
  return (dispatch) => {
    dispatch({ type: JOIN_ROOM, id: parseInt(id, 10) })
    dispatch(socketActions.send({ type: JOIN_ROOM, id: parseInt(id, 10) }))
  }
}

export function exitRoom(id) {
  return (dispatch) => {
    DataChannelService.closeAllPeerConnections()
    dispatch(socketActions.connect())
    dispatch({ type: EXITED_ROOM, id })
  }
}

export function connectedExitRoom(id) {
  return (dispatch) => {
    DataChannelService.closeAllPeerConnections()
    dispatch({ type: EXIT_ROOM, id })
    dispatch(socketActions.send({ type: EXIT_ROOM, id }))
  }
}

export function createdRoom(room) {
  return { type: CREATED_ROOM, room }
}

export function joinedRoom(room) {
  return (dispatch) => {
    dispatch(socketActions.disconnect())
    dispatch({ type: JOINED_ROOM, room })
  }
}

export function exitedRoom() {
  return { type: EXITED_ROOM }
}

export function roomNotCreated() {
  return { type: ROOM_NOT_CREATED }
}

export function roomNotJoined() {
  return { type: ROOM_NOT_JOINED }
}

export function roomNotExited() {
  return { type: ROOM_NOT_EXITED }
}
