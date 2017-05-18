import { actions as socketActions } from '../common/socket'
import { actions as gameActions } from '../game'
import { actions as chatActions } from '../chat'
import { actions as dataChannelActions } from '../common/dataChannel'

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

export const UPDATE_ROOM = 'UPDATE_ROOM'
export const UPDATE_ROOMS = 'UPDATE_ROOMS'
export const CREATE_ROOM = 'CREATE_ROOM'
export const JOIN_ROOM = 'JOIN_ROOM'
export const EXIT_ROOM = 'EXIT_ROOM'
export const ROOM_NOT_CREATED = 'ROOM_NOT_CREATED'
export const ROOM_NOT_JOINED = 'ROOM_NOT_JOINED'
export const ROOM_NOT_EXITED = 'ROOM_NOT_EXITED'
export const JOINED_ROOM = 'JOINED_ROOM'
export const EXITED_ROOM = 'EXITED_ROOM'
export const CREATED_ROOM = 'CREATED_ROOM'

export function updateRoom(room) {
  return (dispatch) => {
    dispatch({ type: UPDATE_ROOM, room })
  }
}

export function updateRooms(rooms) {
  return { type: UPDATE_ROOMS, rooms }
}

export function createRoom() {
  return (dispatch, getState) => {
    if (getState().rooms.isFetching) {
      throw new Error('Again same problem, pls find out what is wrong')
    } else {
      dispatch({ type: CREATE_ROOM })
      dispatch(socketActions.send({ type: CREATE_ROOM }))
    }
  }
}

export function joinRoom(id) {
  return (dispatch) => {
    dispatch({ type: JOIN_ROOM, id: parseInt(id, 10) })
    dispatch(socketActions.send({ type: JOIN_ROOM, id: parseInt(id, 10) }))
  }
}

export function exitRoom(id) {
  return (dispatch, getState) => {
    if (getState().game.started) dispatch(gameActions.exitGame())
    dispatch(chatActions.reset())
    dispatch(dataChannelActions.exitChannel())
    dispatch({ type: EXITED_ROOM, id })
    if (getState().socket.connected) {
      dispatch(socketActions.send({ type: EXIT_ROOM, id }))
    } else {
      dispatch(socketActions.connect())
    }
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
